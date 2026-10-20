# Tareas: Tablero de tareas Tcanvapro

**Entrada**: Documentos de diseño en `/specs/001-task-board/`

**Prerequisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/board-ui.md`, `quickstart.md`.

**Organización**: Fases ordenadas por historias de usuario. Las pruebas independientes de cada fase se describen para validación manual desde la aplicación; no se agregan tareas para crear pruebas automatizadas.

## Formato

Cada tarea usa `- [ ] T### [P?] [US#] Acción y rutas de archivos`. `[P]` se reserva para trabajo que puede ejecutarse en paralelo sin editar los mismos archivos ni depender de tareas incompletas. Las tareas de historias incluyen la etiqueta de historia; setup, base y acabado no.

## Fase 1: Preparación

**Objetivo**: Crear la aplicación web mínima y sus comandos locales.

- [X] T001 Inicializar React con Vite, scripts `dev` y `build`, e instalar dependencias acordadas en `package.json`, `package-lock.json` y `vite.config.js`.
- [X] T002 [P] Crear entrada HTML y punto de montaje de React en `index.html` y `src/main.jsx`, y agregar reglas para ignorar paquetes y compilados en `.gitignore`.
- [X] T003 [P] Crear el componente raíz vacío y estilos globales iniciales en `src/app/App.jsx` y `src/styles/global.css`.

## Fase 2: Base común

**Objetivo**: Preparar persistencia SQLite local y acceso común para todas las historias.

- [X] T004 Instalar y configurar SQLite WASM y preparar recursos WebAssembly públicos para Vite en `package.json` y `vite.config.js`.
- [X] T005 Crear el Web Worker SQLite con VFS `opfs-sahpool`, detección de OPFS, apertura de base y creación idempotente de tablas `sections` y `tasks` en `src/data/sqlite.worker.js`; conservar los nombres, campos, claves foráneas y reglas definidos en `data-model.md`.
- [X] T006 Inicializar las tres secciones por defecto, y solo cuando la base no las haya creado previamente, en `src/data/sqlite.worker.js`.
- [X] T007 Crear el repositorio local que serializa solicitudes al worker, expone carga del tablero y traduce fallos en errores recuperables en `src/data/board-repository.js`.
- [X] T008 Añadir el hook React de carga, suscripción, actualización y reintento para el repositorio en `src/hooks/useBoard.js`.

**Punto de control**: la base se abre desde `localhost`, conserva las secciones iniciales al recargar y el fallo de almacenamiento puede comunicarse a la interfaz.

## Fase 3: Historia 1 - Organizar tareas en el tablero (Prioridad: P1, MVP)

**Objetivo**: Mostrar las columnas y tareas, y permitir crear una tarjeta básica y moverla o reordenarla visualmente.

**Prueba independiente**: En una instalación vacía, ver las tres columnas y conteos; crear una tarea con título, moverla a otra columna y reordenarla con arrastrar y soltar. Recargar la página y comprobar que el estado y el orden persisten. Mover también una tarea usando el teclado.

- [X] T009 [US1] Implementar lectura y ordenamiento de secciones y tareas, y creación mínima de tarea con título y posición siguiente en `src/data/board-repository.js`; rechazar títulos vacíos o de solo espacios.
- [X] T010 [US1] Crear los componentes de tablero, columna y tarjeta con encabezado y conteo por sección en `src/components/Board.jsx`, `src/components/SectionColumn.jsx` y `src/components/TaskCard.jsx`.
- [X] T011 [US1] Implementar el control «Agregar tarea» con título obligatorio en la sección seleccionada en `src/components/TaskComposer.jsx` y conectarlo a `src/app/App.jsx`.
- [X] T012 [US1] Implementar movimiento de tarjetas entre columnas y reordenamiento dentro de una columna mediante arrastrar y soltar en `src/components/Board.jsx` y `src/components/SectionColumn.jsx`; soltar fuera de destino válido debe conservar el orden anterior.
- [X] T013 [US1] Añadir alternativa accesible por teclado para seleccionar una sección destino y mover una tarjeta en `src/components/TaskCard.jsx` y `src/components/SectionColumn.jsx`.
- [X] T014 [US1] Persistir movimientos y reordenamientos en transacciones que actualicen sección y posiciones de origen y destino en `src/data/board-repository.js`.
- [X] T015 [US1] Presentar carga inicial, tablero cargado, estado vacío y errores recuperables de guardado en `src/app/App.jsx` y `src/components/Board.jsx`; mantener visible la tarea pendiente hasta reintentar.
- [X] T016 [US1] Aplicar el diseño oscuro del prototipo, tarjetas y jerarquía visual a `src/styles/global.css` y `src/styles/board.css`.

## Fase 4: Historia 2 - Crear y mantener tareas (Prioridad: P2)

**Objetivo**: Completar los campos opcionales y la edición y eliminación individual de tareas.

**Prueba independiente**: Crear una tarea con descripción y fecha límite, editarla, cancelar otra edición y eliminar una tarjeta tras confirmación. Verificar los cambios después de recargar; al cancelar el borrado, la tarea debe permanecer.

- [X] T017 [US2] Ampliar el formulario de tarea para capturar título, descripción opcional y fecha límite opcional en `src/components/TaskComposer.jsx`; validar título tras recortar espacios.
- [X] T018 [US2] Implementar actualización de título, descripción y fecha límite en `src/data/board-repository.js` y `src/components/TaskEditor.jsx`, preservando el valor anterior si se cancela.
- [X] T019 [US2] Mostrar título y solo la fecha límite disponible en `src/components/TaskCard.jsx`, formateando fechas para español de Perú en `src/utils/format-date.js`.
- [X] T020 [US2] Implementar eliminación individual de tarea en `src/data/board-repository.js` y confirmación de eliminación en `src/components/TaskCard.jsx`; actualizar el conteo de sección al completar la operación.

## Fase 5: Historia 3 - Adaptar columnas al flujo de trabajo (Prioridad: P3)

**Objetivo**: Permitir administrar el nombre, orden y ciclo de vida de secciones sin perder tareas.

**Prueba independiente**: Agregar una sección, renombrarla, cambiar su posición, verificar el conteo y eliminarla vacía. Intentar eliminar una sección con tareas y comprobar que se impide hasta que se trasladen o eliminen.

- [X] T021 [US3] Implementar creación, renombrado y reordenamiento de secciones con nombres no vacíos en `src/data/board-repository.js`.
- [X] T022 [US3] Crear controles «Agregar sección», renombrar y reordenar en `src/components/SectionColumn.jsx` y `src/components/SectionComposer.jsx`.
- [X] T023 [US3] Impedir la eliminación de secciones con tareas, comunicar cómo vaciarlas y confirmar la eliminación de una sección vacía en `src/data/board-repository.js` y `src/components/SectionColumn.jsx`.

## Fase 6: Acabado y revisión transversal

**Objetivo**: Alinear la interfaz final y sus mensajes con la referencia visual, la constitución y las comprobaciones de aceptación.

- [X] T024 Ajustar columnas y tarjetas para pantallas estrechas manteniendo legibles y accesibles las secciones en `src/styles/board.css`.
- [X] T025 Revisar nombres accesibles, foco, estados de error y mensajes en español de Perú en `src/components/Board.jsx`, `src/components/TaskCard.jsx`, `src/components/TaskComposer.jsx` y `src/components/SectionColumn.jsx`.
- [ ] T026 Completar las comprobaciones de aceptación manuales de `quickstart.md` y corregir diferencias del tablero en `src/app/App.jsx`, `src/components/Board.jsx`, `src/components/SectionColumn.jsx` y `src/styles/board.css`.

## Dependencias y orden

```text
Setup (T001-T003)
  └── Base común (T004-T008)
       └── US1 (T009-T016) — MVP
            └── US2 (T017-T020)
                 └── US3 (T021-T023)
                      └── Acabado (T024-T026)
```

**Dependencias entre historias**: US1 establece tablero, tarjetas básicas, repositorio y movimiento persistente. US2 completa los campos y operaciones de ciclo de vida de tarjetas ya disponibles. US3 depende de las tareas básicas para hacer cumplir la regla que impide borrar secciones ocupadas. El acabado se realiza tras integrar las historias.

## Oportunidades de paralelismo

- Dentro de preparación, T002 y T003 están marcadas `[P]` y pueden trabajarse en paralelo una vez que T001 creó el proyecto.
- La fase común es secuencial porque SQLite, el worker, el repositorio y el hook dependen unos de otros.
- No se marcan tareas de historias con `[P]`: cada incremento comparte componentes, estado o repositorio y la secuencia mantiene su integración clara.

## Estrategia de implementación

### MVP

1. Completar preparación y base común (T001-T008).
2. Completar US1 (T009-T016): las tres columnas, conteos, creación mínima y movimiento persistente por arrastre o teclado.
3. Validar independientemente la prueba de US1 y la composición visual del prototipo.

### Entrega incremental

1. Incorporar US2 para completar la gestión de contenido de cada tarjeta.
2. Incorporar US3 para personalizar columnas sin perder tareas.
3. Cerrar con la revisión responsive, accesible y de aceptación manual.

## Notas

- No se añaden tareas para pruebas automatizadas: la especificación define recorridos de aceptación y la skill solo las exige si se piden expresamente. La validación manual se ejecuta desde el navegador siguiendo `quickstart.md`.
- Cada línea de tarea tiene checkbox, ID secuencial y rutas de archivo; las tareas de historias incluyen `[US1]`, `[US2]` o `[US3]`.
