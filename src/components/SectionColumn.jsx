import TaskCard from './TaskCard.jsx';
import TaskComposer from './TaskComposer.jsx';

export default function SectionColumn({
  section,
  tasks,
  sections,
  onAddTask,
  onRetryTask,
  onMoveTask,
  onEditTask,
  onDeleteTask,
  onRename,
  onMoveSection,
  onDeleteSection,
  saving,
}) {
  function onDropTask(event, position = tasks.length) {
    const raw = event.dataTransfer.getData('application/x-tcanvapro-task');
    if (!raw) return;
    event.preventDefault();
    event.stopPropagation();
    let dragged;
    try {
      dragged = JSON.parse(raw);
    } catch {
      return;
    }
    if (!dragged.taskId || !dragged.sourceSectionId) return;
    let nextPosition = position;
    if (dragged.sourceSectionId === section.id && dragged.sourceIndex < position) nextPosition -= 1;
    onMoveTask(dragged.taskId, section.id, Math.max(0, nextPosition));
  }

  function onDropSection(event) {
    const sectionId = Number(event.dataTransfer.getData('application/x-tcanvapro-section'));
    if (!sectionId) return;
    event.preventDefault();
    event.stopPropagation();
    if (!sections.some((candidate) => candidate.id === sectionId)) return;
    onMoveSection(sectionId, section.position);
  }

  function onHeaderKeyDown(event) {
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      const offset = event.key === 'ArrowLeft' ? -1 : 1;
      onMoveSection(section.id, Math.max(0, Math.min(section.position + offset, sections.length - 1)));
    }
  }

  return (
    <section
      className="board-column"
      aria-labelledby={`section-${section.id}`}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes('application/x-tcanvapro-task') || event.dataTransfer.types.includes('application/x-tcanvapro-section')) event.preventDefault();
      }}
      onDrop={(event) => {
        if (event.dataTransfer.types.includes('application/x-tcanvapro-task')) onDropTask(event);
        else onDropSection(event);
      }}
    >
      <header
        className="board-column__header"
        tabIndex="0"
        aria-label={`${section.name}, ${tasks.length} tareas. Arrastrar para cambiar de posición. Usa Alt más flecha izquierda o derecha para moverla con el teclado.`}
        draggable
        onKeyDown={onHeaderKeyDown}
        onDragStart={(event) => {
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('application/x-tcanvapro-section', String(section.id));
        }}
      >
        <h2 id={`section-${section.id}`}>{section.name}</h2>
        <span className="board-column__count" aria-label={`${tasks.length} tareas`}>{tasks.length}</span>
        <div className="section-actions">
          <button className="icon-button" type="button" onClick={() => onRename(section)} aria-label={`Renombrar ${section.name}`} title="Renombrar sección">✎</button>
          <button className="icon-button danger-icon" type="button" onClick={() => onDeleteSection(section)} aria-label={`Eliminar ${section.name}`} title="Eliminar sección">×</button>
        </div>
      </header>
      <div className="board-column__tasks" aria-label={`Tareas de ${section.name}`}>
        {tasks.map((task, index) => (
          <TaskCard
            key={task.id}
            task={task}
            index={index}
            sectionId={section.id}
            sections={sections}
            onMoveTask={onMoveTask}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
      <TaskComposer
        sectionId={section.id}
        onSubmit={(task) => onAddTask(section.id, task)}
        onRetry={(task) => onRetryTask(section.id, task)}
        saving={saving}
      />
    </section>
  );
}
