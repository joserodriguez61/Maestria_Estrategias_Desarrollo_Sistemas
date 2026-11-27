export const requirementPages = [
  {
    href: '#/canalizacion-minima',
    label: 'Canalización mínima',
    summary: 'TaskFlow cumple los cinco requisitos. Cada ejecución parte de un commit y produce una compilación probada y un paquete identificable.',
    requirements: [
      {
        title: 'Disparador por commit o solicitud de integración',
        description: 'Un push a main inicia el flujo, incluso si la actualización proviene de la fusión de un pull request. Esto cubre el disparador por commit que pide el requisito.',
        evidence: 'on.push.branches: [main]',
      },
      {
        title: 'Instalación controlada de dependencias',
        description: 'npm ci instala las versiones fijadas en package-lock.json y falla si el archivo de bloqueo y package.json están desincronizados.',
        evidence: 'npm ci --no-audit --no-fund',
      },
      {
        title: 'Compilación y validación',
        description: 'ESLint revisa el código y TypeScript verifica los tipos. La compilación usa Vite para generar el sitio en dist/.',
        evidence: 'npm run lint · npm exec --no -- tsc --noEmit · npm run build',
      },
      {
        title: 'Pruebas automatizadas',
        description: 'Vitest realiza las pruebas unitarias de las operaciones sobre tareas y de su almacenamiento. Un fallo detiene la ejecución antes de publicar el paquete.',
        evidence: 'npm test',
      },
      {
        title: 'Artefacto identificable',
        description: 'GitHub Actions guarda el ZIP de la compilación y su suma de verificación SHA-256. El identificador del commit figura en el nombre del ZIP, lo que permite rastrear su origen.',
        evidence: 'taskflow-<SHA>.zip · taskflow-<SHA>.zip.sha256',
      },
    ],
  },
  {
    href: '#/calidad-y-seguridad',
    label: 'Calidad y seguridad',
    summary: 'TaskFlow cumple las medidas básicas con el historial de Git, permisos limitados y controles automáticos que deben pasar antes de publicar.',
    requirements: [
      {
        title: 'Control de versiones',
        description: 'Git conserva el historial del código y del workflow. GitHub Actions asocia cada ejecución con su commit y el ZIP lleva ese mismo identificador.',
      },
      {
        title: 'Gestión de secretos',
        description: 'GitHub Actions proporciona un token temporal. El paso que consulta main lo recibe como variable de entorno y el YAML solo contiene la referencia al token.',
        evidence: 'GH_TOKEN: ${{ github.token }}',
      },
      {
        title: 'Permisos mínimos',
        description: 'El workflow parte sin permisos predeterminados. La integración recibe lectura del repositorio. Solo el trabajo de despliegue obtiene también escritura en Pages y permiso para solicitar un token de identidad.',
        evidence: 'permissions: {} · contents: read · pages: write · id-token: write',
      },
      {
        title: 'Registro de ejecuciones',
        description: 'La pestaña Actions conserva el historial del flujo con el commit, el resultado y los registros de cada paso. Desde cada ejecución también se puede descargar el artefacto mientras siga disponible.',
      },
      {
        title: 'Controles automáticos',
        description: 'ESLint revisa el código y npm audit examina las dependencias. La auditoría falla si detecta vulnerabilidades altas o críticas, lo que impide que avance el despliegue.',
        evidence: 'npm run lint · npm audit --audit-level=high',
      },
    ],
  },
  {
    href: '#/reproduccion',
    label: 'Reproducción desde cero',
    summary: 'Sigue este procedimiento para obtener el código de TaskFlow, comprobar la compilación en tu navegador y publicarla en GitHub Pages.',
    requirements: [
      {
        title: 'Preparar el entorno',
        description: 'Instala Git, npm y Node.js. Para usar la misma rama principal que CI, instala Node.js 22.12 o posterior dentro de la rama 22. GitHub Actions usa Ubuntu 24.04 y Node.js 22. Comprueba que los tres comandos devuelvan una versión.',
        evidence: 'git --version\nnode --version\nnpm --version',
      },
      {
        title: 'Obtener el código fuente',
        description: 'Clona el repositorio con una cuenta que tenga acceso. También puedes descargar el ZIP del código fuente desde Code → Download ZIP y extraerlo. Abre una terminal en la carpeta que contiene package.json y package-lock.json.',
        evidence: 'git clone https://github.com/joserodriguez61/Maestria_Estrategias_Desarrollo_Sistemas.git\ncd Maestria_Estrategias_Desarrollo_Sistemas',
      },
      {
        title: 'Instalar las dependencias',
        description: 'Ejecuta el comando desde la raíz del proyecto. npm usa package.json y package-lock.json para reproducir la instalación. La app local funciona sin archivo .env ni credenciales.',
        evidence: 'npm ci',
      },
      {
        title: 'Validar, probar y compilar',
        description: 'Ejecuta los comandos en orden. Comprueba que ESLint termine sin errores, que Vitest apruebe todas las pruebas y que la compilación termine correctamente y genere dist/index.html.',
        evidence: 'npm run lint\nnpm test\nnpm run build',
      },
      {
        title: 'Abrir la compilación en el navegador',
        description: 'Inicia la vista previa, deja la terminal abierta y visita la URL que indique Vite, normalmente http://localhost:4173/. Agrega una tarea y recarga la página. La tarea debe seguir visible.',
        evidence: 'npm run preview',
      },
      {
        title: 'Publicar el sitio en GitHub Pages',
        description: 'En un repositorio de GitHub donde puedas configurar Pages, selecciona Settings → Pages → Build and deployment → Source → GitHub Actions. Confirma que el código fuente y el workflow estén en la rama main. Sube o fusiona un cambio a main después de configurar Pages. En Actions, abre la ejecución de TaskFlow CI/CD y comprueba que terminen correctamente la integración y el despliegue del commit más reciente. El workflow obtiene SITE_URL automáticamente de la publicación.',
      },
      {
        title: 'Verificar la versión publicada',
        description: 'Abre la URL del entorno github-pages que aparece en la ejecución del workflow. Comprueba que la interfaz cargue y que puedas agregar y completar una tarea. El último paso del workflow también comprueba la respuesta HTTP de la página y el tipo de contenido del módulo JavaScript.',
      },
    ],
  },
]
