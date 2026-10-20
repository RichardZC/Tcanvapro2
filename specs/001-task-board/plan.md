# Plan de implementación: Tablero de tareas Tcanvapro

**Rama**: `001-task-board` | **Fecha**: 2026-10-20 | **Spec**: [spec.md](spec.md)

**Entrada**: Especificación de funcionalidad en `specs/001-task-board/spec.md`.

## Resumen

Construir un tablero personal de tareas con React y Vite, con almacenamiento SQLite persistente y local al origen del navegador. La interfaz seguirá el prototipo validado: tema oscuro, columnas «Asignadas recientemente», «En proceso» y «Terminado», encabezados con conteos y tarjetas con título y fecha límite opcional. Las tarjetas podrán crearse, editarse, eliminarse y ordenarse o moverse por arrastre y su alternativa accesible. Para que SQLite persista en el navegador sin cuenta ni servidor de datos remoto, se ejecutará SQLite WASM en un Web Worker y se guardará la base mediante OPFS. La decisión y sus límites están documentados en [research.md](research.md).

## Contexto técnico

**Lenguaje/versión**: JavaScript con módulos ES; ejecución en navegadores modernos.

**Dependencias principales**: React, Vite y SQLite WASM oficial.

**Almacenamiento**: SQLite WASM sobre OPFS, operado desde Web Worker; los datos quedan vinculados al origen del sitio en ese navegador y dispositivo.

**Validación**: compilación de producción y comprobación manual en navegador de persistencia OPFS, arrastre, teclado y recorridos de aceptación.

**Plataforma objetivo**: Navegadores modernos en escritorio y tamaños adaptables; contexto seguro HTTPS o `localhost` para OPFS.

**Tipo de proyecto**: Aplicación web React/Vite, de cliente, sin API de servidor ni cuentas.

**Metas de rendimiento**: El movimiento de tarjeta debe actualizar el tablero de forma inmediata para la persona; cumplir los tiempos de uso de SC-001 y SC-002.

**Restricciones**: Una sola persona y un tablero local; sin exportar, importar, sincronizar, cuentas ni borrado masivo. OPFS puede estar sujeto a cuota del navegador y a que la persona borre los datos del sitio. La interfaz debe estar en español de Perú y ajustarse al prototipo oscuro validado.

**Persistencia operativa**: SQLite WASM usa `opfs-sahpool` desde un worker Vite (`new Worker(new URL(...), { type: 'module' })`); no requiere cabeceras de aislamiento COOP/COEP. Se inicializa un solo worker y una sola conexión en cola serializada. La base se guarda en el OPFS del origen `localhost`/HTTPS; Safari/Firefox necesitan soporte OPFS y modo seguro.

**Escala/alcance**: Un tablero, un dispositivo y un origen de navegador, tres secciones iniciales personalizables y el conjunto de tareas personales sin límite de negocio establecido.

## Revisión de constitución

*Puerta: debe pasar antes de investigar; se vuelve a revisar después del diseño.*

| Principio | Estado | Aplicación en este diseño |
|---|---|---|
| Simplicidad ante todo | Cumple | Una sola aplicación de cliente, sin cuentas ni servicio de backend. |
| Idioma y mercado: Perú | Cumple | Interfaz y fechas en español de Perú; no se presentan importes. |
| Cero alcance fantasma | Cumple | El prototipo guía la composición visual; comentarios, reacciones, asignaciones, archivos y etiquetas quedan fuera. |
| Verificabilidad por una persona no técnica | Cumple | Los flujos principales se validan desde el tablero en navegador. |
| Respeto por los datos del usuario | Cumple | Solo se guardan título, descripción y fecha límite de tareas, secciones y posiciones; no hay credenciales ni servicios de terceros. |

No se observan conflictos con la constitución. Tras el diseño, la solución sigue alineada con los cinco principios.

## Estructura del proyecto

### Documentación de esta funcionalidad

```text
specs/001-task-board/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── board-ui.md
```

### Código fuente (raíz del repositorio)

```text
src/
├── app/                   # Composición de la vista principal y estado de carga/error
├── components/            # Tablero, encabezados de sección, tarjetas y formularios
├── data/
│   ├── board-repository.js # Operaciones de lectura/escritura del tablero
│   └── sqlite.worker.js    # Inicialización SQLite WASM y comandos de persistencia
├── hooks/                 # Integración React con el repositorio local
└── styles/                # Tema oscuro y adaptación de pantalla

```

**Decisión de estructura**: una aplicación web en la raíz, sin división artificial frontend/backend. El Web Worker contiene el acceso a SQLite y la interfaz se comunica con un repositorio local. Se conservan separadas la presentación, las operaciones del tablero y la persistencia.

## Registro de complejidad

No hay excepciones a la constitución ni proyectos adicionales que justificar.
