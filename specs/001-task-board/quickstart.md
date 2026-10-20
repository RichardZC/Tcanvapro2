# GuÃƒÂ­a rÃƒÂ¡pida de validaciÃƒÂ³n: Tablero de tareas

## Requisitos

- Node.js LTS instalado y npm.
- Navegador moderno con OPFS habilitado. Para el alcance planificado, usar Chrome/Edge recientes, Firefox reciente o Safari 16.4 o posterior.
- En desarrollo, usar el origen `localhost`, que es un contexto seguro para APIs del navegador.

## Arranque local

Desde la raÃƒÂ­z del proyecto:

```powershell
npm install
npm run dev
```

Abrir la URL local que informa Vite (normalmente `http://localhost:5173`).

## CompilaciÃƒÂ³n

```powershell
npm run build
```

Resultado esperado: la compilaciÃƒÂ³n de producciÃƒÂ³n termina sin errores. La validaciÃƒÂ³n funcional se realiza manualmente en navegador con los recorridos siguientes.

## Recorridos de aceptaciÃƒÂ³n en navegador

1. Abrir la aplicaciÃƒÂ³n por primera vez. Ver las tres secciones en el orden previsto y sus conteos en cero.
2. Crear una tarea con tÃƒÂ­tulo y otra con tÃƒÂ­tulo, descripciÃƒÂ³n y fecha lÃƒÂ­mite. Verificar que la tarjeta de la segunda muestra la fecha y la primera no muestra una fecha ficticia.
3. Mover una tarea arrastrÃƒÂ¡ndola a otra secciÃƒÂ³n; reordenar otra tarjeta dentro de una secciÃƒÂ³n. Recargar la pÃƒÂ¡gina y confirmar secciÃƒÂ³n y orden.
4. Usar teclado para mover una tarea a otra secciÃƒÂ³n y verificar el mismo resultado.
5. Editar tÃƒÂ­tulo, descripciÃƒÂ³n y fecha lÃƒÂ­mite; cancelar una ediciÃƒÂ³n y verificar que conserva los valores previos.
6. Eliminar una tarea confirmando el diÃƒÂ¡logo; cancelar otro borrado y verificar que la tarjeta permanece.
7. Crear, renombrar y reordenar una secciÃƒÂ³n. Intentar borrar una secciÃƒÂ³n con tareas y comprobar que la aplicaciÃƒÂ³n indica cÃƒÂ³mo vaciarla. Vaciarla, borrarla y confirmar.
8. Verificar que los encabezados muestran el conteo vigente tras cada alta, movimiento y eliminaciÃƒÂ³n.
9. Probar el diseÃƒÂ±o con ancho de escritorio y uno estrecho; comprobar que tareas y controles siguen disponibles y legibles.
10. Probar la interfaz con almacenamiento deshabilitado o un error de SQLite. Debe informar que no se pudo guardar, conservar el contenido del formulario y ofrecer un botón de reintento antes de cerrar la vista.

Los datos de prueba se conservan entre recargas en el mismo origen del navegador. Para iniciar un recorrido desde una base vacÃƒÂ­a, borrar los datos locales del sitio desde las herramientas del navegador; esto elimina permanentemente esa base de prueba.
