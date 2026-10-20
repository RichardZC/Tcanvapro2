# Contrato de interacción del tablero

Este producto no expone una API a otros sistemas. Este documento fija los comportamientos visibles para implementación y revisión.

## Vista inicial

- Mostrar, de izquierda a derecha cuando el ancho lo permita, las columnas iniciales «Asignadas recientemente», «En proceso» y «Terminado».
- Cada encabezado muestra el nombre de sección y el conteo de sus tareas.
- Aplicar fondo oscuro, superficies de tarjetas distinguibles, tipografía legible y acciones «Agregar tarea» y «Agregar sección» siguiendo el prototipo validado.
- Una tarjeta muestra título y fecha límite si existe. Descripción y fecha límite se editan en la vista de edición; los indicadores sin semántica especificada en la referencia no se simulan como funciones.
- En pantallas estrechas, mantener accesibles todas las secciones sin comprimir ilegiblemente las tarjetas.

## Acciones

- «Agregar tarea» abre un formulario en la sección elegida; título requerido, descripción y fecha límite opcionales.
- Editar abre los mismos campos con sus valores actuales. Cancelar descarta cambios no guardados.
- Eliminar tarea pide confirmación antes de quitar la tarjeta.
- Arrastrar una tarjeta cambia su sección y posición. Soltar fuera de una ubicación aceptada revierte la posición visual.
- Cada tarea ofrece también un control accesible por teclado para escoger sección y moverla; la operación produce el mismo resultado que el arrastre.
- Agregar y renombrar sección exige un nombre no vacío. Las secciones pueden reordenarse.
- Eliminar una sección vacía requiere confirmación. En una sección con tareas, informar que primero deben trasladarse o eliminarse; impedir el borrado hasta que quede vacía.
- No mostrar una acción de borrado general, exportación, importación, cuentas ni sincronización.

## Persistencia y errores

- Tras iniciar, mostrar tablero y tareas guardadas del origen actual.
- Guardar en SQLite cada cambio confirmado y reflejarlo al recargar la página.
- Si OPFS/SQLite no está disponible o una escritura falla, explicar en español que no se pudo guardar, conservar el formulario o la operación pendiente en la vista y ofrecer reintento. No indicar que el cambio está guardado hasta completar la escritura.
- Mostrar un estado de carga inicial y un mensaje útil si no es posible abrir el almacenamiento local.

## Idioma y accesibilidad

- Etiquetas, validaciones, confirmaciones y errores en español de Perú.
- Fechas límite presentadas con formato local de Perú.
- Acciones y campos utilizables con teclado; controles con nombre accesible; el movimiento de tarjetas no depende solo del arrastre.
