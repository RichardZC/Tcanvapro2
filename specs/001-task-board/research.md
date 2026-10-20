# Investigación: almacenamiento local SQLite en navegador

**Fecha**: 2026-10-20  
**Funcionalidad**: [Tablero de tareas Tcanvapro](spec.md)

## Decisión 1: ejecutar SQLite en el navegador con persistencia OPFS

**Decisión**: Usar la distribución oficial SQLite WASM en un Web Worker y el VFS `opfs-sahpool` para guardar el archivo SQLite en el Origin Private File System (OPFS). La base se identifica con un nombre fijo de aplicación; no se crea un archivo visible ni se solicita acceso al sistema de archivos del usuario.

**Motivo**: La spec requiere SQLite y limita los datos al dispositivo y navegador actuales, sin cuentas, API remota ni sincronización. OPFS persiste archivos privados por origen del navegador. La documentación de SQLite recomienda `opfs-sahpool` cuando se prioriza rendimiento y no se requieren conexiones concurrentes, y especifica que se inicializa dentro de un worker. La documentación de navegadores confirma que OPFS es almacenamiento privado por origen, está disponible en contextos seguros y puede ser eliminado al borrar los datos del sitio. [SQLite WASM: persistencia](https://www.sqlite.org/wasm/doc/trunk/persistence.md), [MDN: OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system.)

**Alternativas consideradas**:

- Node.js y SQLite nativo detrás de una API local: proporciona un archivo SQLite convencional, pero introduce un proceso de servidor que la app personal requiere arrancar y no es necesario para un tablero cliente sin servicios externos.
- SQLite solo en memoria o descarga/subida del archivo: no satisface la persistencia automática entre sesiones descrita por FR-004, o contradice la decisión de no trasladar los datos.
- IndexedDB sin SQLite: simplifica persistencia web, pero contradice el stack vigente registrado en `AGENTS.md`.

**Límites y mitigaciones**: OPFS requiere un contexto seguro y está sujeto a cuota del navegador. El acceso sincronizado que necesita este VFS ocurre dentro de un worker, por lo que la interfaz no debe abrir la base directamente. Al iniciar, comprobar soporte y apertura de la base; ante fallo mostrar el mensaje definido en el contrato y conservar los datos ingresados en la vista para reintentar. Abrir la misma base desde más de una pestaña puede competir por el archivo; la app solo garantiza una instancia activa por origen. No se ofrece recuperación si la persona borra los datos del sitio, pues exportación y copias están fuera de alcance.

## Decisión 2: mantener una sola aplicación React/Vite y sin API

**Decisión**: La aplicación y sus datos se ejecutan en el navegador. Vite sirve desarrollo y empaqueta la interfaz; la capa de datos se limita al repositorio local y su Web Worker SQLite.

**Motivo**: Vite ofrece servidor de desarrollo y compilación de recursos estáticos; no se necesita integración de backend para esta arquitectura. [Vite: guía de inicio](https://vite.dev/guide/), [Vite: compilación de producción](https://vite.dev/guide/build)

**Alternativas consideradas**:

- API Node separada: se rechaza por añadir proceso, endpoints y mantenimiento que no aporta a la función local individual.
- Servidor de aplicaciones: no hay renderizado de servidor, autenticación ni datos compartidos que lo requieran.

## Decisión 3: mantener validación manual desde la interfaz

**Decisión**: No se configura una herramienta de pruebas automatizadas para la primera entrega. Los recorridos funcionales y la persistencia OPFS se validan manualmente en un navegador moderno siguiendo `quickstart.md`; `npm run build` comprueba la compilación de producción.

**Motivo**: El usuario pidió implementar la funcionalidad y la skill de implementación no exige crear pruebas automatizadas salvo solicitud expresa. Los recorridos manuales cubren la persistencia real de SQLite WASM en OPFS, que una base simulada no demostraría.

**Alternativas consideradas**: Vitest podría añadirse después si se solicita automatizar reglas y componentes. Para comprobar flujos visuales y OPFS real también se requeriría navegador automatizado, fuera del alcance actual.
