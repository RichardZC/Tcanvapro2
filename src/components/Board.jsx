import SectionColumn from './SectionColumn.jsx';

export default function Board({ board, saving, onAddTask, onRetryTask, onMoveTask, onEditTask, onDeleteTask, onRenameSection, onMoveSection, onDeleteSection, onAddSection }) {
  return (
    <>
      <div className="board-scroll-region">
        <div className="board-columns" aria-label="Secciones del tablero">
          {board.sections.map((section) => (
            <SectionColumn
              key={section.id}
              section={section}
              tasks={board.tasks.filter((task) => task.sectionId === section.id)}
              sections={board.sections}
              onAddTask={onAddTask}
              onRetryTask={onRetryTask}
              onMoveTask={onMoveTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onRename={onRenameSection}
              onMoveSection={onMoveSection}
              onDeleteSection={onDeleteSection}
              saving={saving}
            />
          ))}
          <button className="add-section-button" type="button" onClick={onAddSection}>
            <span aria-hidden="true">＋</span> Agregar sección
          </button>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{saving ? 'Guardando cambios…' : 'Cambios guardados en este navegador'}</p>
    </>
  );
}
