# TaskFlow

Aplicación web de gestión de tareas en español, desarrollada con React, TypeScript, Vite y Tailwind CSS. Puedes agregar tareas, marcar o desmarcar su estado y eliminarlas. Las tareas se conservan al recargar gracias a LocalStorage.

## Reproducción desde cero

1. Instala Git, npm y Node.js 22.12 o posterior dentro de la rama 22 para usar la misma rama principal que CI. Comprueba las versiones con `git --version`, `node --version` y `npm --version`. CI usa Ubuntu 24.04 y Node.js 22.
2. Clona el repositorio con una cuenta que tenga acceso o descarga y extrae el ZIP del código fuente desde **Code → Download ZIP**. Abre la carpeta que contiene `package.json` y `package-lock.json`.

   ```bash
   git clone https://github.com/joserodriguez61/Maestria_Estrategias_Desarrollo_Sistemas.git
   cd Maestria_Estrategias_Desarrollo_Sistemas
   ```

3. Instala las dependencias fijadas, valida el código, ejecuta las pruebas y compila.

   ```bash
   npm ci
   npm run lint
   npm test
   npm run build
   ```

   La aplicación local funciona sin un archivo `.env`. Los comandos deben terminar correctamente y la compilación debe generar `dist/index.html`.

4. Ejecuta `npm run preview` y abre en el navegador la URL que indique Vite, normalmente `http://localhost:4173/`. Agrega una tarea y recarga la página para comprobar que se conserva.
5. Para obtener una URL de GitHub Pages, sigue los pasos de [habilitación de la publicación](#habilitar-la-publicación). Abre la URL del entorno `github-pages` cuando CI y CD hayan terminado correctamente. El workflow asigna automáticamente `SITE_URL` para verificar la página y su módulo JavaScript.

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

El workflow [TaskFlow CI/CD](.github/workflows/ci-cd.yml) ejecuta CI con Node.js 22 únicamente cuando un push actualiza `main`, incluido el que genera la fusión de un pull request. El flujo instala con `npm ci`, ejecuta ESLint, TypeScript y Vitest, bloquea vulnerabilidades altas y críticas con `npm audit --audit-level=high` y compila la aplicación. El ZIP `taskflow-<SHA>.zip` y su suma de verificación SHA-256 quedan disponibles en la pestaña **Actions**.

Si CI termina correctamente y el commit sigue siendo el más reciente en `main`, CD publica el artefacto de `dist/` en el entorno `github-pages` y verifica por HTTP la página y el tipo MIME de su módulo JavaScript.

### Habilitar la publicación

1. En el repositorio de GitHub, abre **Settings → Pages**.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**. [Configurar la fuente de publicación](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
3. Sube o fusiona los cambios a `main`. Cuando termine el despliegue, abre la URL que muestra el entorno `github-pages`.

La compilación utiliza rutas relativas para servir el favicon, CSS y JavaScript tanto bajo la ruta del repositorio como en la raíz de un dominio. Las tareas del dominio anterior permanecen en el LocalStorage de ese dominio.
