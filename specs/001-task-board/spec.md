# Especificación de funcionalidad: Tablero de tareas Tcanvapro

**Rama de funcionalidad**: `001-task-board`

**Creado**: 2026-10-20

**Estado**: Borrador

**Entrada**: Descripción del usuario: «Crea la especificación de un gestor de tareas llamado Tcanvapro, debe manejar la gestión de tareas con el tablero Canva, debe ser simple para poder mover las tareas según drag and drop, usa como referencia la imagen adjunta validada».

## Escenarios de usuario y pruebas

### Historia de usuario 1: Organizar tareas en un tablero (Prioridad: P1)

Como persona que organiza su trabajo, quiero ver las tareas distribuidas en columnas de estado y moverlas arrastrándolas, para entender el avance y actualizarlo rápidamente.

**Por qué esta prioridad**: El tablero visual y el movimiento directo de tarjetas son el propósito central de Tcanvapro.

**Prueba independiente**: Abrir el tablero con tareas de ejemplo o creadas, arrastrar una tarjeta a otra columna y comprobar que aparece allí y conserva su información.

**Escenarios de aceptación**:

1. **Dado** un tablero con las columnas «Asignadas recientemente», «En proceso» y «Terminado», **cuando** la persona lo abre, **entonces** ve cada columna y sus tareas en tarjetas legibles.
2. **Dada** una tarea en una columna, **cuando** la persona la arrastra a otra columna y la suelta, **entonces** la tarjeta queda en la columna de destino y su estado se actualiza.
3. **Dadas** varias tareas en una columna, **cuando** la persona reordena una mediante arrastrar y soltar, **entonces** el nuevo orden se refleja en el tablero.
4. **Dado** un cambio de estado u orden, **cuando** la persona vuelve a abrir el tablero, **entonces** el cambio sigue guardado.

---

### Historia de usuario 2: Crear y mantener tareas (Prioridad: P2)

Como persona usuaria, quiero agregar una tarea desde una columna y mantener su título y fecha, para registrar trabajo sin salir del tablero.

**Por qué esta prioridad**: El tablero solo resulta útil cuando se pueden registrar y mantener las tareas que muestra.

**Prueba independiente**: Agregar una tarea a una columna, cambiar su título o fecha, y verificar que los cambios quedan visibles y guardados; luego eliminarla y comprobar que ya no aparece.

**Escenarios de aceptación**:

1. **Dada** una columna, **cuando** la persona elige «Agregar tarea», escribe un título válido y guarda, **entonces** aparece una tarjeta en esa columna.
2. **Dada** una tarea existente, **cuando** la persona actualiza su título, descripción o fecha límite, **entonces** la tarjeta y sus detalles muestran los valores actualizados.
3. **Dada** una tarea existente, **cuando** la persona confirma su eliminación, **entonces** deja de aparecer en el tablero.
4. **Cuando** se intenta guardar una tarea sin título, **entonces** el sistema solicita un título y no crea una tarjeta vacía.

---

### Historia de usuario 3: Adaptar las columnas al flujo de trabajo (Prioridad: P3)

Como persona usuaria, quiero agregar, renombrar, ordenar y quitar secciones, para adaptar las etapas del tablero a mi forma de trabajar.

**Por qué esta prioridad**: Las columnas personalizadas amplían el tablero sencillo cuando el flujo de trabajo necesita otras etapas.

**Prueba independiente**: Crear una sección, cambiar su nombre, moverla de posición y eliminarla; verificar el resultado en cada paso y que los cambios persisten.

**Escenarios de aceptación**:

1. **Dado** el tablero, **cuando** la persona elige «Agregar sección» y escribe un nombre, **entonces** aparece una columna con ese nombre.
2. **Dada** una columna, **cuando** la persona cambia su nombre o posición, **entonces** el tablero refleja y conserva el cambio.
3. **Dada** una columna con tareas, **cuando** la persona solicita eliminarla, **entonces** el sistema informa que contiene tareas y solicita resolverlas antes de confirmar; ninguna tarea se elimina sin decisión explícita.

### Casos límite

- Si el título de una tarea o el nombre de una sección está vacío o contiene solo espacios, el sistema no lo guarda y señala el campo requerido.
- Si se suelta una tarea fuera de una columna válida, conserva su columna y orden anteriores.
- Una columna no puede eliminarse mientras tenga tareas sin que la persona decida primero mover o eliminar esas tareas.
- Un tablero sin tareas muestra las columnas disponibles y una opción para agregar la primera tarea.
- Si no hay fecha límite, la tarjeta no muestra una fecha ficticia.
- Las fechas se presentan en español de Perú y no se confunden con la fecha de creación.

## Requisitos

### Requisitos funcionales

- **FR-001**: El sistema MUST mostrar un tablero con columnas de estado y tarjetas de tarea; incluirá inicialmente «Asignadas recientemente», «En proceso» y «Terminado».
- **FR-002**: El sistema MUST permitir mover una tarea entre columnas mediante arrastrar y soltar, actualizando su estado.
- **FR-003**: El sistema MUST permitir reordenar tareas dentro de una columna mediante arrastrar y soltar.
- **FR-004**: El sistema MUST conservar las tareas, estados, orden y secciones después de cerrar y volver a abrir la aplicación.
- **FR-005**: El sistema MUST permitir crear tareas desde una columna con título obligatorio y descripción y fecha límite opcionales.
- **FR-006**: El sistema MUST permitir editar y eliminar tareas, solicitando confirmación antes de eliminarlas.
- **FR-007**: Cada tarjeta MUST mostrar el título y, cuando exista, su fecha límite; los detalles opcionales no disponibles no se representarán como valores inventados.
- **FR-008**: El sistema MUST permitir crear, renombrar, reordenar y eliminar secciones del tablero.
- **FR-009**: Antes de eliminar una sección con tareas, el sistema MUST requerir que la persona mueva o elimine sus tareas y confirme la acción.
- **FR-010**: La interfaz y los mensajes dirigidos a usuarios MUST estar en español de Perú.
- **FR-011**: Las acciones de arrastrar y soltar MUST tener una alternativa accesible para mover una tarea a otra columna sin arrastrarla.
- **FR-012**: El tablero MUST mostrar una indicación comprensible si no puede guardar un cambio y permitir reintentar sin perder los datos ingresados.

### Entidades clave

- **Tablero**: espacio personal que contiene secciones y sus tareas.
- **Sección**: columna con nombre y posición dentro del tablero; agrupa tareas por etapa.
- **Tarea**: elemento de trabajo con título, descripción opcional, fecha límite opcional, sección y posición dentro de ella.

## Criterios de éxito

### Resultados medibles

- **SC-001**: En una prueba de uso, al menos 9 de cada 10 personas pueden mover una tarea a otra sección y reconocer el nuevo estado en menos de 10 segundos, sin instrucciones externas.
- **SC-002**: Al menos 9 de cada 10 personas pueden crear una tarea con título desde el tablero en menos de 30 segundos.
- **SC-003**: En todos los casos de aceptación, las tareas y secciones creadas y sus cambios siguen visibles al cerrar y volver a abrir la aplicación.
- **SC-004**: Una persona puede distinguir las tres secciones iniciales y reconocer el título y la fecha límite disponible de cada tarea en una sola vista del tablero.
- **SC-005**: Ninguna tarea se pierde ni cambia de sección cuando se cancela o falla un intento de arrastre.

## Supuestos

- La versión inicial está dirigida a una sola persona y un tablero local; no incluye cuentas, colaboración entre personas ni sincronización entre dispositivos.
- El tablero utiliza las tres secciones iniciales mostradas en la imagen de referencia, y permite personalizarlas.
- La imagen adjunta es referencia visual para una vista oscura de columnas con encabezados, conteos, tarjetas, fechas y acciones para agregar tareas y secciones. No se infieren funciones de comentarios, reacciones, asignación, archivos adjuntos ni etiquetas operativas a partir de iconos no explicados.
- Las tareas no tienen prioridad, asignatario ni repetición en esta versión, dado que no se solicitaron explícitamente.
- La aplicación se utilizará en una pantalla web adaptable; el movimiento de tareas debe seguir siendo posible con teclado u otra alternativa accesible.
