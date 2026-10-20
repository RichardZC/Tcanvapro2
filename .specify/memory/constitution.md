<!--
Sync Impact Report
Version change: sin versión ratificada -> 1.0.0 (constitución inicial)
Principios modificados: ninguno; se establecen cinco principios nuevos.
Secciones añadidas: Restricciones del producto; Flujo de desarrollo y revisión.
Secciones eliminadas: ninguna.
Pendiente: TODO(RATIFICATION_DATE): se desconoce la fecha original de adopción.
-->

# TCanvaPro Constitution

## Core Principles

### I. Simplicidad ante todo
Ante dos soluciones que satisfacen por completo la especificación (spec), MUST elegirse la
más simple. No se añadirán abstracciones, opciones ni capacidades futuras sin un requisito
escrito en la spec. La versión 1 prioriza resolver las necesidades explícitas sin complejidad
anticipada.

### II. Idioma y mercado: Perú
Todo el producto dirigido a usuarios MUST estar en español de Perú. Los importes MUST
expresarse en soles peruanos (PEN), con formato local, por ejemplo, «S/». La interfaz,
los mensajes y los importes visibles se comprobarán en la aplicación.

### III. Cero alcance fantasma
Solo se implementará funcionalidad descrita en la spec vigente. Las ideas nuevas se
propondrán para su evaluación y, si se aprueban, se incorporarán primero a la spec; no se
construirán como parte de un cambio que no las contemple.

### IV. Verificabilidad por una persona no técnica
Cada criterio de éxito MUST poder comprobarse usando la aplicación, sin leer código ni
ejecutar herramientas de desarrollo. Los criterios que no permitan esa comprobación se
reformularán antes de dar por aceptada la funcionalidad.

### V. Respeto por los datos del usuario
El producto MUST solicitar únicamente los datos imprescindibles para la funcionalidad
descrita en la spec. No se introducirán claves, tokens, credenciales ni otros secretos en el
código fuente.

## Restricciones del producto

La spec vigente es la fuente de alcance para cada cambio. La interfaz, los mensajes y los
valores monetarios que se presenten a usuarios deben respetar el español de Perú y el uso
de soles peruanos establecido en estos principios. La recopilación de datos y el código
deben respetar los límites del principio V.

## Flujo de desarrollo y revisión

Antes de aceptar un cambio, se comprobará que su alcance está escrito en la spec y que
cualquier criterio de éxito puede verificarse desde la aplicación. La revisión confirmará
también el idioma y la moneda en las superficies de usuario afectadas, la necesidad de los
datos solicitados y la ausencia de secretos añadidos al código fuente.

## Governance

Esta constitución rige las decisiones de producto y desarrollo. Si una spec o un cambio
entra en conflicto con ella, el conflicto debe hacerse explícito y resolverse antes de
implementar o aceptar el cambio; no se permiten excepciones tácitas.

Para modificar la constitución, se propondrá el texto y su justificación para aprobación
explícita por la persona responsable del proyecto. Las modificaciones aprobadas se
registrarán aquí y actualizarán la fecha de enmienda. El versionado semántico se aplicará
así: MAJOR para eliminar o redefinir de forma incompatible un principio o regla; MINOR
para añadir principios o ampliar materialmente la gobernanza; PATCH para aclaraciones y
cambios editoriales sin alterar el significado.

Cada spec y cada cambio de producto se revisará frente a estos principios antes de su
aceptación. La revisión debe comprobar el alcance documentado, los criterios verificables
en la aplicación, la localización y moneda cuando sean pertinentes, la minimización de
datos y que no se hayan incorporado secretos al código fuente.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-10-20
