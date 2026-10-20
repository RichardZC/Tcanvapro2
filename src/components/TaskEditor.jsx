import { useEffect, useId, useState } from 'react';

export default function TaskEditor({ task, onSave, onClose, saving }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.dueDate ?? '');
  const [error, setError] = useState('');
  const [pendingChanges, setPendingChanges] = useState(null);
  const id = useId();

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setDueDate(task.dueDate ?? '');
    setError('');
    setPendingChanges(null);
  }, [task]);

  async function submit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    setError('');
    const changes = { id: task.id, title: title.trim(), description, dueDate };
    if (await onSave(changes)) {
      window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
      onClose();
    }
    else {
      setPendingChanges(changes);
      setError('No se pudo guardar. Conservamos tus cambios; inténtalo nuevamente.');
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <h2 id="task-dialog-title">Editar tarea</h2>
        <form onSubmit={submit}>
          <label htmlFor={`${id}-title`}>Nombre de la tarea</label>
          <input id={`${id}-title`} autoFocus value={title} onChange={(event) => setTitle(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
          <label htmlFor={`${id}-description`}>Descripción <span className="optional-label">(opcional)</span></label>
          <textarea id={`${id}-description`} rows="4" value={description} onChange={(event) => setDescription(event.target.value)} />
          <label htmlFor={`${id}-date`}>Fecha límite <span className="optional-label">(opcional)</span></label>
          <input id={`${id}-date`} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
          {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
          {error && <button className="text-button" type="button" disabled={saving} onClick={async () => {
            if (await onSave(pendingChanges)) {
              window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
              onClose();
            }
            else setError('Aún no se pudo guardar. Tus cambios siguen disponibles; vuelve a intentarlo.');
          }}>Reintentar guardado</button>}
          <div className="form-actions form-actions--end">
            <button className="text-button" type="button" onClick={onClose}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>Guardar cambios</button>
          </div>
        </form>
      </section>
    </div>
  );
}
