import { useEffect, useId, useState } from 'react';

export default function SectionComposer({ section, onSave, onClose, saving }) {
  const [name, setName] = useState(section?.name ?? '');
  const [error, setError] = useState('');
  const [pendingName, setPendingName] = useState(null);
  const id = useId();

  useEffect(() => {
    setName(section?.name ?? '');
    setError('');
    setPendingName(null);
  }, [section]);

  async function submit(event) {
    event.preventDefault();
    if (!name.trim()) {
      setError('Escribe el nombre de la sección.');
      return;
    }
    setError('');
    if (await onSave(name)) {
      window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
      onClose();
    }
    else {
      setPendingName(name);
      setError('No se pudo guardar. Conservamos el nombre; inténtalo nuevamente.');
    }
  }

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="dialog" aria-modal="true" aria-labelledby="section-dialog-title">
        <h2 id="section-dialog-title">{section ? 'Renombrar sección' : 'Agregar sección'}</h2>
        <form onSubmit={submit}>
          <label htmlFor={`${id}-name`}>Nombre</label>
          <input id={`${id}-name`} autoFocus value={name} onChange={(event) => setName(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} />
          {error && <p className="field-error" id={`${id}-error`}>{error}</p>}
          {error && <button className="text-button" type="button" disabled={saving} onClick={async () => {
            if (await onSave(pendingName)) {
              window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
              onClose();
            }
            else setError('Aún no se pudo guardar. El nombre sigue disponible; vuelve a intentarlo.');
          }}>Reintentar guardado</button>}
          <div className="form-actions form-actions--end">
            <button className="text-button" type="button" onClick={onClose}>Cancelar</button>
            <button className="primary-button" type="submit" disabled={saving}>Guardar</button>
          </div>
        </form>
      </section>
    </div>
  );
}
