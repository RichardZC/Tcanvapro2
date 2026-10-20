import { formatDueDate } from '../utils/format-date.js';

export default function TaskCard({
  task,
  index,
  sectionId,
  onMoveTask,
  onEdit,
  onDelete,
  sections,
}) {
  function onDragStart(event) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('application/x-tcanvapro-task', JSON.stringify({
      taskId: task.id,
      sourceSectionId: sectionId,
      sourceIndex: index,
    }));
  }

  function onDrop(event) {
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
    if (!dragged.taskId || !dragged.sourceSectionId || !sections.some((section) => section.id === dragged.sourceSectionId)) return;
    let position = index;
    if (dragged.sourceSectionId === sectionId && dragged.sourceIndex < index) position -= 1;
    onMoveTask(dragged.taskId, sectionId, Math.max(0, position));
  }

  return (
    <article
      className="task-card"
      aria-label={task.description ? `${task.title}. ${task.description}` : task.title}
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => {
        if (event.dataTransfer.types.includes('application/x-tcanvapro-task')) event.preventDefault();
      }}
      onDrop={onDrop}
    >
      <div className="task-card__title-row">
        <span className="task-card__status-mark" aria-hidden="true" />
        <p className="task-card__title">{task.title}</p>
        <div className="task-card__actions">
          <button className="icon-button" type="button" onClick={() => onEdit(task)} aria-label={`Editar ${task.title}`} title="Editar tarea">✎</button>
          <button className="icon-button danger-icon" type="button" onClick={() => onDelete(task)} aria-label={`Eliminar ${task.title}`} title="Eliminar tarea">×</button>
        </div>
      </div>
      <div className="task-card__footer">
        {task.dueDate ? <time className="task-card__date" dateTime={task.dueDate}>{formatDueDate(task.dueDate)}</time> : <span />}
        <label className="move-control">
          <select
            aria-label={`Mover ${task.title} a otra sección. Elige el nuevo destino.`}
            value={sectionId}
            onChange={(event) => onMoveTask(task.id, Number(event.target.value), 0)}
          >
            <option value={sectionId}>Mover a...</option>
            {sections.filter((section) => section.id !== sectionId).map((section) => (
              <option key={section.id} value={section.id}>{section.name}</option>
            ))}
          </select>
        </label>
      </div>
      {task.description && <p className="task-card__description">{task.description}</p>}
    </article>
  );
}
