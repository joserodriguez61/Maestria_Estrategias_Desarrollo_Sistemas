import { useRef } from 'react'
import workflowSource from '../../.github/workflows/ci-cd.yml?raw'

const integrationSteps = [
  ['Obtener el código', 'Descarga el código del commit que inició la ejecución.'],
  ['Configurar Node.js', 'Prepara Node.js 22 para ejecutar los comandos del proyecto.'],
  ['Instalar dependencias', 'Ejecuta npm ci para instalar las versiones fijadas en package-lock.json.'],
  ['Ejecutar ESLint', 'Revisa el código con las reglas de ESLint del proyecto.'],
  ['Validar TypeScript', 'Comprueba los tipos sin generar archivos.'],
  ['Ejecutar Vitest', 'Corre las pruebas unitarias de TaskFlow.'],
  ['Auditar dependencias', 'Detiene el flujo si npm detecta vulnerabilidades altas o críticas.'],
  ['Compilar TaskFlow', 'Comprueba los tipos y usa Vite para generar la aplicación en dist/.'],
  ['Crear el ZIP y su suma de verificación SHA-256', 'Verifica que exista dist/index.html, comprime dist/ y calcula una suma para comprobar la integridad del ZIP.'],
  ['Publicar artefacto', 'Deja el ZIP y su suma disponibles para descargar en GitHub Actions durante 14 días.'],
  ['Preparar el artefacto para GitHub Pages', 'En un push a main, entrega la carpeta dist/ al proceso de despliegue.'],
]

const deploymentSteps = [
  ['Comprobar que el commit sigue en main', 'Consulta el commit más reciente de main y solo permite desplegar si coincide con el de esta ejecución.'],
  ['Publicar el artefacto en GitHub Pages', 'Publica la compilación preparada por la integración continua.'],
  ['Comprobar la página y el módulo JavaScript', 'Verifica que la página y su módulo JavaScript respondan correctamente y que el módulo tenga el tipo de contenido esperado. Reintenta hasta un total de seis veces.'],
]

export function WorkflowGuide() {
  const dialog = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}
        className="ml-auto rounded-lg border border-indigo-200 px-3 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-50">
        Ver guía de CI/CD
      </button>
      <dialog ref={dialog} aria-labelledby="workflow-guide-title"
        className="fixed inset-0 m-auto max-h-[85dvh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xl backdrop:bg-slate-950/50 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <h2 id="workflow-guide-title" className="text-xl font-bold">CI/CD paso a paso</h2>
          <form method="dialog">
            <button type="submit" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              Cerrar
            </button>
          </form>
        </div>
        <p className="mt-4 text-sm text-slate-700">
          El flujo se inicia con un push a main, incluido el que se genera al fusionar un PR, o al ejecutarlo manualmente desde GitHub Actions.
        </p>
        <h3 className="mt-6 font-bold">Integración continua</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {integrationSteps.map(([title, description]) => (
            <li key={title}><strong>{title}.</strong> {description}</li>
          ))}
        </ol>
        <h3 className="mt-6 font-bold">Despliegue continuo</h3>
        <p className="mt-2 text-sm text-slate-700">
          Se ejecuta después de una integración exitosa iniciada por un push a main.
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          {deploymentSteps.map(([title, description]) => (
            <li key={title}><strong>{title}.</strong> {description}</li>
          ))}
        </ol>
        <details className="mt-6 border-t border-slate-200 pt-4">
          <summary className="cursor-pointer font-semibold text-indigo-800">Ver el archivo ci-cd.yml</summary>
          <pre tabIndex={0} className="mt-3 max-h-80 overflow-auto rounded-lg bg-slate-950 p-4 text-xs text-slate-100">
            <code>{workflowSource}</code>
          </pre>
        </details>
      </dialog>
    </>
  )
}
