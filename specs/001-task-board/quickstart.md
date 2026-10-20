# Guía rápida de validación: Tablero de tareas

## Requisitos

- Node.js LTS instalado y npm.
- Navegador moderno con OPFS habilitado. Para el alcance planificado, usar Chrome/Edge recientes, Firefox reciente o Safari 16.4 o posterior.
- En desarrollo, usar el origen `localhost`, que es un contexto seguro para APIs del navegador.

## Arranque local

Desde la raíz del proyecto:

```powershell
npm install
npm run dev
```

Abrir la URL local que informa Vite. Los scripts se concretarán cuando se cree `package.json`.

## Comprobaciones automatizadas y compilación

```powershell
npm test
npm run build
```

Resultado esperado: las pruebas de reglas y componentes pasan y la compilación termina sin errores.

## Recorridos de aceptación en navegador

1. Abrir la aplicación por primera vez. Ver las tres secciones en el orden previsto y sus conteos en cero.
2. Crear una tarea con título y otra con título, descripción y fecha límite. Verificar que la tarjeta de la segunda muestra la fecha y la primera no muestra una fecha ficticia.
3. Mover una tarea arrastrándola a otra sección; reordenar otra tarjeta dentro de una sección. Recargar la página y confirmar sección y orden.
4. Usar teclado para mover una tarea a otra sección y verificar el mismo resultado.
5. Editar título, descripción y fecha límite; cancelar una edición y verificar que conserva los valores previos.
6. Eliminar una tarea confirmando el diálogo; cancelar otro borrado y verificar que la tarjeta permanece.
7. Crear, renombrar y reordenar una sección. Intentar borrar una sección con tareas y comprobar que la aplicación indica cómo vaciarla. Vaciarla, borrarla y confirmar.
8. Verificar que los encabezados muestran el conteo vigente tras cada alta, movimiento y eliminación.
9. Probar el diseño con ancho de escritorio y uno estrecho; comprobar que tareas y controles siguen disponibles y legibles.
10. Comprobar un fallo de almacenamiento o la falta de soporte OPFS en un entorno de prueba: la aplicación informa el problema, conserva la entrada y ofrece reintentar sin afirmar que guardó.

Los datos de prueba se conservan entre recargas en el mismo origen del navegador. Para iniciar un recorrido desde una base vacía, borrar los datos locales del sitio desde las herramientas del navegador; esto elimina permanentemente esa base de prueba.
