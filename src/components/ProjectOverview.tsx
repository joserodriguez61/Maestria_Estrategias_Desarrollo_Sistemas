const tools = [
  ['React y React DOM', 'Renderizado de la interfaz y gestión del estado.'],
  ['Lucide React', 'Iconos de la aplicación.'],
  ['Vite', 'Servidor de desarrollo, compilación y vista previa.'],
  ['Tailwind CSS', 'Estilos y diseño adaptable a distintos tamaños de pantalla.'],
  ['TypeScript', 'Verificación estática de tipos.'],
  ['Vitest y ESLint', 'Pruebas unitarias y análisis estático del código.'],
]

const commands = [
  ['npm ci', 'Instala las versiones fijadas en package-lock.json.'],
  ['npm test', 'Ejecuta las pruebas unitarias de las operaciones sobre tareas y de su almacenamiento.'],
  ['npm run build', 'Verifica los tipos y genera la versión de producción en dist/.'],
  ['npm run preview', 'Sirve la compilación localmente. Abre la URL que indique Vite.'],
]

export function ProjectOverview() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 sm:py-15">
      <h1 className="text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl">Ficha técnica de TaskFlow</h1>
      <p className="mt-4 max-w-3xl leading-relaxed text-ink-700">
        TaskFlow es la aplicación web de código propio seleccionada para el ejercicio.
        Permite agregar, completar y eliminar tareas, y conserva los cambios en el navegador mediante LocalStorage.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <dt className="text-lg font-bold text-ink-950">Lenguaje</dt>
          <dd className="mt-2 text-ink-700">TypeScript con TSX para los componentes de React y CSS para los estilos.</dd>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <dt className="text-lg font-bold text-ink-950">Licencia del proyecto</dt>
          <dd className="mt-2 text-ink-700">Código propio. El repositorio no declara una licencia para el código de TaskFlow.</dd>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <dt className="text-lg font-bold text-ink-950">Entorno local</dt>
          <dd className="mt-2 text-ink-700">
            Node.js 20.19 o superior dentro de la rama 20, o Node.js 22.12 o superior, con npm y un navegador moderno.
            La aplicación se ejecuta en el navegador y almacena ahí los datos.
          </dd>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-5">
          <dt className="text-lg font-bold text-ink-950">Entorno de integración</dt>
          <dd className="mt-2 text-ink-700">
            GitHub Actions usa Ubuntu 24.04 y Node.js 22. Consulta la <a href="#/guia-cicd"
              className="font-semibold text-sage-800 underline">guía de CI/CD</a> para ver el flujo.
          </dd>
        </div>
      </dl>

      <section className="mt-9">
        <h2 className="text-2xl font-bold text-ink-950">Dependencias principales</h2>
        <dl className="mt-4 divide-y divide-ink-200 rounded-2xl border border-ink-200 bg-white px-5">
          {tools.map(([name, purpose]) => (
            <div key={name} className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]">
              <dt className="font-semibold text-ink-900">{name}</dt>
              <dd className="text-ink-700">{purpose}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-9">
        <h2 className="text-2xl font-bold text-ink-950">Compilación y pruebas</h2>
        <p className="mt-2 text-ink-700">Ejecuta estos comandos en orden desde la raíz del repositorio.</p>
        <ol className="mt-4 list-decimal space-y-3 pl-5 marker:font-semibold marker:text-sage-800">
          {commands.map(([command, description]) => (
            <li key={command} className="rounded-xl border border-ink-200 bg-white p-4">
              <code className="rounded-md bg-sage-50 px-2 py-1 text-sm font-semibold text-sage-900">{command}</code>
              <p className="mt-2 text-ink-700">{description}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
