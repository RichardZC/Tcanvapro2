import { useId, useState } from 'react';

export default function TaskComposer({ sectionId, onSubmit, onRetry, saving }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const id = useId();
  const [pendingTask, setPendingTask] = useState(null);

  async function submit(event) {
    event.preventDefault();
    if (!title.trim()) {
      setError('Escribe el nombre de la tarea.');
      return;
    }
    setError('');
    const task = { title: title.trim(), description, dueDate };
    const saved = await onSubmit(task);
    if (saved) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPendingTask(null);
      setOpen(false);
      window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
    } else {
      setPendingTask(task);
      setError('No se pudo guardar. Conservamos el texto; inténtalo nuevamente.');
    }
  }

  if (!open) {
    return (
      <button className="add-task-button" type="button" onClick={() => setOpen(true)}>
        <span aria-hidden="true">＋</span> Agregar tarea
      </button>
    );
  }

  return (
    <form className="task-composer" onSubmit={submit}>
      <label className="sr-only" htmlFor={`${id}-title`}>Nombre de la tarea</label>
      <input
        id={`${id}-title`}
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Escribe el nombre de la tarea"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      <label className="sr-only" htmlFor={`${id}-description`}>Descripción (opcional)</label>
      <textarea id={`${id}-description`} rows="2" placeholder="Descripción (opcional)" aria-label="Descripción (opcional)" value={description} onChange={(event) => setDescription(event.target.value)} />
      <label className="sr-only" htmlFor={`${id}-date`}>Fecha límite (opcional)</label>
      <input id={`${id}-date`} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
      {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
      {error && <button className="text-button" type="button" disabled={saving} onClick={async () => {
        const saved = await onRetry(pendingTask);
        if (saved) {
          setTitle(''); setDescription(''); setDueDate(''); setPendingTask(null); setError(''); setOpen(false);
          window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
        } else {
          setError('Aún no se pudo guardar. El contenido permanece en el formulario; vuelve a intentarlo.');
        }
      }}>Reintentar guardado</button>}
      <div className="form-actions">
        <button className="primary-button" type="submit" disabled={saving}>{error ? 'Reintentar guardado' : 'Guardar'}</button>
        <button className="text-button" type="button" onClick={() => { setOpen(false); setError(''); }}>Cancelar</button>
      </div>
    </form>
  );
}
