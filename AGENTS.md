# Tcanvapro

Gestor de tareas mediante el tablero Canva.

## Stack y decisiones vigentes

- Aplicación web en React con Vite.
- Base de datos SQLite.
- Mantener soluciones simples y limitar el alcance a lo descrito en la spec vigente.

## Desarrollo local

- Arranque: `npm install` y `npm run dev` desde la raíz.
- Verificación local: `npm run build` desde la raíz; no se ha configurado un runner de pruebas automatizadas.

## Convenciones

- Interfaz y mensajes para usuarios en español de Perú; importes en soles (S/).
- Solicitar solo los datos imprescindibles; nunca incluir secretos en el código.
- Los criterios de aceptación deben poder comprobarse desde la aplicación.
- Antes de implementar, confirmar que el alcance figure en la spec vigente.

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en specs/README.md
