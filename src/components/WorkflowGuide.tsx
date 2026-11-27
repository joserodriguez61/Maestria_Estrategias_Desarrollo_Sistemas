import workflowSource from '../../.github/workflows/ci-cd.yml?raw'

const stepBlocks = new Map<string, string>()
for (const match of workflowSource.matchAll(/^ {6}- name: (.+)\r?\n(?:^ {8}.*(?:\r?\n|$)|^\r?\n)*/gm)) {
  stepBlocks.set(match[1], match[0].trimEnd().replace(/^ {6}/gm, ''))
}

const triggers = workflowSource.match(/^on:\r?\n(?:^ {2,}.*\r?\n)*/m)?.[0].trimEnd()

type WorkflowStep = [title: string, description: string, parameters?: [string, string][]]

const integrationSteps: WorkflowStep[] = [
  ['Obtener el código', 'Descarga el código del commit enviado a main que inició la ejecución.', [
    ['uses: actions/checkout@…', 'Ejecuta la acción de descarga fijada a un commit específico.'],
    ['persist-credentials: false', 'Evita que la acción conserve sus credenciales en la configuración de Git.'],
  ]],
  ['Configurar Node.js', 'Prepara el entorno para ejecutar los comandos del proyecto.', [
    ["node-version: '22'", 'Selecciona la rama 22 de Node.js.'],
    ['package-manager-cache: false', 'Desactiva la caché automática de dependencias de esta acción.'],
  ]],
  ['Instalar dependencias', 'Ejecuta npm ci para instalar las versiones fijadas en package-lock.json.'],
  ['Ejecutar ESLint', 'Revisa el código con las reglas de ESLint del proyecto.'],
  ['Validar TypeScript', 'Comprueba los tipos del proyecto.', [
    ['--noEmit', 'Indica a TypeScript que compruebe los tipos sin generar archivos.'],
  ]],
  ['Ejecutar Vitest', 'Corre las pruebas unitarias de TaskFlow.'],
  ['Auditar dependencias', 'Busca vulnerabilidades conocidas en las dependencias.', [
    ['--audit-level=high', 'Hace fallar el comando si npm detecta vulnerabilidades altas o críticas.'],
  ]],
  ['Compilar TaskFlow', 'Comprueba los tipos y usa Vite para generar la aplicación en dist/.'],
  ['Crear el ZIP y su suma de verificación SHA-256', 'Verifica que exista dist/index.html, comprime dist/ y calcula una suma para comprobar la integridad del ZIP.'],
  ['Publicar artefacto', 'Guarda la compilación como descarga en GitHub Actions.', [
    ['with.name / path', 'Identifica el artefacto por commit e intento y selecciona el ZIP y su suma SHA-256.'],
    ['if-no-files-found: error', 'Hace fallar el paso si ninguna ruta coincide con archivos.'],
    ['retention-days: 14', 'Mantiene la descarga disponible durante 14 días.'],
  ]],
  ['Preparar el artefacto para GitHub Pages', 'Entrega la compilación al proceso de despliegue.', [
    ['path: dist', 'Selecciona la carpeta generada por Vite para publicar el sitio.'],
  ]],
]

const deploymentSteps: WorkflowStep[] = [
  ['Comprobar que el commit sigue en main', 'Consulta el commit más reciente de main y solo permite desplegar si coincide con el de esta ejecución.', [
    ['env.GH_TOKEN', 'Proporciona el token temporal que autentica la consulta a GitHub.'],
    ['id: current-main', 'Permite que los pasos siguientes consulten el resultado deploy de esta comprobación.'],
  ]],
  ['Publicar el artefacto en GitHub Pages', 'Publica la compilación preparada por la integración continua.', [
    ['if', 'Ejecuta la publicación solo si la comprobación anterior produjo deploy=true.'],
    ['id: deployment', 'Permite recuperar la URL que devuelve la acción de publicación.'],
  ]],
  ['Comprobar la página y el módulo JavaScript', 'Verifica que la página y su módulo JavaScript respondan correctamente y que el módulo tenga el tipo de contenido esperado. Reintenta hasta un total de seis veces.', [
    ['if', 'Ejecuta la verificación cuando la comprobación del commit permite publicar.'],
    ['env.SITE_URL', 'Recibe la dirección que devolvió el paso de publicación.'],
  ]],
]

function YamlBlock({ source, label }: { source: string; label: string }) {
  return (
    <pre tabIndex={0} aria-label={label}
      className="min-w-0 overflow-auto rounded-xl bg-ink-950 p-4 text-sm leading-relaxed text-ink-100 sm:p-5 md:text-base">
      <code>{source}</code>
    </pre>
  )
}

function WorkflowSteps({ steps }: { steps: WorkflowStep[] }) {
  return (
    <ol className="mt-5 list-decimal space-y-4 pl-5 marker:font-semibold marker:text-accent-800">
      {steps.map(([title, description, parameters]) => (
        <li key={title} className="rounded-2xl border border-ink-200 bg-white p-4 sm:p-6">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-ink-950">{title}</h3>
              <p className="mt-2 leading-relaxed text-ink-700">{description}</p>
              {parameters && (
                <dl className="mt-4 space-y-3 border-t border-ink-200 pt-4">
                  {parameters.map(([parameter, meaning]) => (
                    <div key={parameter}>
                      <dt><code className="wrap-anywhere font-semibold text-accent-800">{parameter}</code></dt>
                      <dd className="mt-1 leading-relaxed text-ink-700">{meaning}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            <YamlBlock source={stepBlocks.get(title) ?? ''} label={`YAML de ${title}`} />
          </div>
        </li>
      ))}
    </ol>
  )
}

export function WorkflowGuide() {
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:px-8 sm:py-15">
      <h1 className="text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">7. Guía del YAML de CI/CD</h1>

      <section className="mt-8 rounded-2xl border border-ink-200 bg-white p-5 sm:p-6">
        <h2 className="text-2xl font-bold text-ink-950">Cuándo se ejecuta</h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-ink-700">
          GitHub Actions ejecuta el flujo únicamente cuando un <code>push</code> actualiza <code>main</code>,
          incluido el que se genera al fusionar un pull request.
        </p>
        <div className="mt-4">
          <YamlBlock source={triggers ?? ''} label="YAML de los disparadores" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-950">Integración continua</h2>
        <WorkflowSteps steps={integrationSteps} />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-ink-950">Despliegue continuo</h2>
        <p className="mt-2 leading-relaxed text-ink-700">
          Se ejecuta cuando la integración del commit enviado a <code>main</code> termina correctamente.
        </p>
        <WorkflowSteps steps={deploymentSteps} />
      </section>

      <details className="mt-10 border-t border-ink-200 pt-5">
        <summary className="mb-4 cursor-pointer font-semibold text-accent-800">Ver el archivo ci-cd.yml completo</summary>
        <YamlBlock source={workflowSource} label="Archivo ci-cd.yml completo" />
      </details>
    </main>
  )
}
