# TaskFlow

Aplicación web de gestión de tareas en español, desarrollada con React, TypeScript, Vite y Tailwind CSS. Puedes agregar tareas, marcar o desmarcar su estado y eliminarlas. Las tareas se conservan al recargar gracias a LocalStorage.

## Desarrollo local

Requiere Node.js 20.19 o superior en la rama 20, o Node.js 22.12 o posterior, y npm.

```bash
npm ci
npm run dev
```

Abre la dirección que muestra Vite en la terminal.

## Comandos

| Comando | Resultado |
| --- | --- |
| `npm test` | Ejecuta las pruebas unitarias con Vitest. |
| `npm run test:watch` | Vuelve a ejecutar las pruebas al cambiar los archivos. |
| `npm run lint` | Analiza el código con ESLint. |
| `npm run build` | Comprueba los tipos y genera la compilación en `dist/`. |
| `npm run preview` | Sirve localmente la compilación generada. |

## Estructura

- `src/components/` contiene el formulario y la lista de tareas.
- `src/services/` valida, lee y guarda los datos en LocalStorage.
- `src/types/` define el modelo de las tareas.
- `src/utils/` contiene la validación de títulos y las operaciones sobre la lista.

Las tareas se guardan en el perfil y origen actuales del navegador. Si el almacenamiento falla, la aplicación muestra un aviso y permite seguir trabajando en la sesión actual.

## CI/CD con GitHub Actions y GitHub Pages

El workflow [TaskFlow CI/CD](.github/workflows/ci-cd.yml) ejecuta CI con Node.js 22 en pushes a `main`, pull requests con destino a `main` y ejecuciones manuales. Instala con `npm ci`, ejecuta ESLint, TypeScript y Vitest, bloquea vulnerabilidades altas y críticas con `npm audit --audit-level=high` y compila la aplicación. El ZIP `taskflow-<SHA>.zip` y su checksum SHA-256 quedan disponibles en la pestaña **Actions**.

En un push a `main` con CI exitoso, el workflow entrega la misma carpeta `dist/` como artefacto de Pages. CD publica ese artefacto en el entorno `github-pages` sin volver a compilar y verifica por HTTP la página y el tipo MIME de su módulo JavaScript.

### Habilitar la publicación

1. En el repositorio de GitHub, abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**. [Configurar la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. Sube el cambio a `main`. Cuando terminen CI y CD, abre la URL del despliegue que muestra el entorno `github-pages`. En un sitio de proyecto suele ser `https://<usuario>.github.io/<repositorio>/`.

La compilación utiliza rutas relativas para servir el favicon, CSS y JavaScript tanto bajo la ruta del repositorio como en la raíz de un dominio. Las tareas del dominio anterior permanecen en el LocalStorage de ese dominio.
