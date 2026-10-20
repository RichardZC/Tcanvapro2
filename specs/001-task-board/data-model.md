# Modelo de datos: Tablero de tareas

La base es un único tablero lógico por origen de navegador. No necesita una tabla `Board`: cada sección pertenece implícitamente a ese tablero. Todas las tablas usan claves primarias enteras internas y claves foráneas activadas.

## `sections`

Representa una columna del tablero.

| Campo | Tipo lógico | Reglas |
|---|---|---|
| `id` | entero | Clave primaria. |
| `name` | texto | Obligatorio; no vacío después de quitar espacios al inicio y al final. |
| `position` | entero | Obligatorio; orden visual, comenzando en cero. |

Al iniciar por primera vez se crean, en este orden: «Asignadas recientemente», «En proceso» y «Terminado». Si la base ya existe, no se vuelven a insertar ni se restablecen sus valores.

## `tasks`

Representa una tarjeta de trabajo perteneciente a una sección.

| Campo | Tipo lógico | Reglas |
|---|---|---|
| `id` | entero | Clave primaria. |
| `title` | texto | Obligatorio; no vacío después de quitar espacios al inicio y al final. |
| `description` | texto anulable | Opcional. |
| `due_date` | fecha ISO `YYYY-MM-DD` anulable | Opcional; fecha límite, no fecha de creación. |
| `section_id` | entero | Obligatorio; referencia a `sections.id`. |
| `position` | entero | Obligatorio; orden dentro de la sección, comenzando en cero. |

## Relaciones y ciclo de vida

- Una sección contiene cero o más tareas; una tarea pertenece exactamente a una sección.
- El estado de una tarea se deriva de la sección en la que aparece. Al moverla, se actualizan su `section_id` y su posición, y se ajustan las posiciones afectadas dentro de las columnas de origen y destino en una sola transacción.
- Reordenar una columna actualiza las posiciones de las tareas afectadas en una transacción.
- Crear, renombrar o reordenar secciones actualiza sus campos; ordenar secciones no cambia el estado ni el orden de las tareas.
- Una tarea se elimina de forma individual tras confirmación.
- Una sección solo se elimina cuando no tiene tareas y la persona confirma la acción. La base usa restricción de clave foránea para impedir el borrado accidental de tareas relacionadas.
- Los datos persisten en el archivo SQLite del OPFS del origen actual. Borrar datos del sitio en el navegador puede eliminar esa base.
