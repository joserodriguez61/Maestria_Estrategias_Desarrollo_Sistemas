import workflowSource from '../../.github/workflows/ci-cd.yml?raw'

const stepBlocks = new Map<string, string>()
for (const match of workflowSource.matchAll(/^ {6}- name: (.+)\r?\n(?:^ {8}.*(?:\r?\n|$)|^\r?\n)*/gm)) {
  stepBlocks.set(match[1], match[0].trimEnd().replace(/^ {6}/gm, ''))
}

const triggers = workflowSource.match(/^on:\r?\n(?:^ {2,}.*\r?\n)*/m)?.[0].trimEnd()

const integrationSteps = [
  ['Obtener el código', 'Descarga el código del commit enviado a main que inició la ejecución.'],
  ['Configurar Node.js', 'Prepara Node.js 22 para ejecutar los comandos del proyecto.'],
  ['Instalar dependencias', 'Ejecuta npm ci para instalar las versiones fijadas en package-lock.json.'],
  ['Ejecutar ESLint', 'Revisa el código con las reglas de ESLint del proyecto.'],
  ['Validar TypeScript', 'Comprueba los tipos sin generar archivos.'],
  ['Ejecutar Vitest', 'Corre las pruebas unitarias de TaskFlow.'],
  ['Auditar dependencias', 'Detiene el flujo si npm detecta vulnerabilidades altas o críticas.'],
  ['Compilar TaskFlow', 'Comprueba los tipos y usa Vite para generar la aplicación en dist/.'],
  ['Crear el ZIP y su suma de verificación SHA-256', 'Verifica que exista dist/index.html, comprime dist/ y calcula una suma para comprobar la integridad del ZIP.'],
  ['Publicar artefacto', 'Deja el ZIP y su suma disponibles para descargar en GitHub Actions durante 14 días.'],
  ['Preparar el artefacto para GitHub Pages', 'Entrega la carpeta dist/ al proceso de despliegue.'],
]

const deploymentSteps = [
  ['Comprobar que el commit sigue en main', 'Consulta el commit más reciente de main y solo permite desplegar si coincide con el de esta ejecución.'],
  ['Publicar el artefacto en GitHub Pages', 'Publica la compilación preparada por la integración continua.'],
  ['Comprobar la página y el módulo JavaScript', 'Verifica que la página y su módulo JavaScript respondan correctamente y que el módulo tenga el tipo de contenido esperado. Reintenta hasta un total de seis veces.'],
]

function YamlBlock({ source, label }: { source: string; label: string }) {
  return (
    <pre tabIndex={0} aria-label={label}
      className="min-w-0 overflow-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100 sm:p-5">
      <code>{source}</code>
    </pre>
  )
}

function WorkflowSteps({ steps }: { steps: string[][] }) {
  return (
    <ol className="mt-5 list-decimal space-y-4 pl-5 marker:font-semibold marker:text-indigo-800">
      {steps.map(([title, description]) => (
        <li key={title} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
          <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 leading-relaxed text-slate-700">{description}</p>
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
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">CI/CD paso a paso</h1>

      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-2xl font-bold text-slate-950">Cuándo se ejecuta</h2>
        <p className="mt-2 max-w-3xl leading-relaxed text-slate-700">
          GitHub Actions ejecuta el flujo únicamente cuando un <code>push</code> actualiza <code>main</code>,
          incluido el que se genera al fusionar un pull request.
        </p>
        <div className="mt-4">
          <YamlBlock source={triggers ?? ''} label="YAML de los disparadores" />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Integración continua</h2>
        <WorkflowSteps steps={integrationSteps} />
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-slate-950">Despliegue continuo</h2>
        <p className="mt-2 leading-relaxed text-slate-700">
          Se ejecuta cuando la integración del commit enviado a <code>main</code> termina correctamente.
        </p>
        <WorkflowSteps steps={deploymentSteps} />
      </section>

      <details className="mt-10 border-t border-slate-200 pt-5">
        <summary className="mb-4 cursor-pointer font-semibold text-indigo-800">Ver el archivo ci-cd.yml completo</summary>
        <YamlBlock source={workflowSource} label="Archivo ci-cd.yml completo" />
      </details>
    </main>
  )
}
