import { useEffect, useState } from 'react';
import Board from '../components/Board.jsx';
import SectionComposer from '../components/SectionComposer.jsx';
import TaskEditor from '../components/TaskEditor.jsx';
import { useBoard } from '../hooks/useBoard.js';

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onClose, saving }) {
  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-message">
        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>
        <div className="form-actions form-actions--end">
          <button className="text-button" type="button" autoFocus onClick={onClose}>Cancelar</button>
          {confirmLabel && <button className="danger-button" type="button" onClick={onConfirm} disabled={saving}>{confirmLabel}</button>}
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const { board, loading, saving, error, refresh, perform } = useBoard();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [sectionDialog, setSectionDialog] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [dismissedError, setDismissedError] = useState(false);

  useEffect(() => {
    setDismissedError(false);
  }, [error]);

  useEffect(() => {
    function dismissAfterSave() {
      setDismissedError(true);
    }
    window.addEventListener('tcanvapro:clear-save-error', dismissAfterSave);
    return () => window.removeEventListener('tcanvapro:clear-save-error', dismissAfterSave);
  }, []);

  async function moveTask(taskId, sectionId, position) {
    const saved = await perform('moveTask', { id: taskId, sectionId, position });
    if (saved) window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
    return saved;
  }

  function requestDeleteTask(task) {
    setConfirmation({ kind: 'task', value: task });
  }

  function requestDeleteSection(section) {
    const sectionTasks = board.tasks.filter((task) => task.sectionId === section.id);
    setConfirmation({ kind: sectionTasks.length ? 'occupied-section' : 'section', value: section });
  }

  async function confirmDelete() {
    if (!confirmation) return;
    const operation = confirmation.kind === 'task' ? 'deleteTask' : 'deleteSection';
    const saved = await perform(operation, { id: confirmation.value.id });
    if (saved) {
      setConfirmation(null);
      window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
    }
  }

  async function saveSection(name) {
    if (sectionDialog?.section) {
      const saved = await perform('renameSection', { id: sectionDialog.section.id, name });
      if (saved) window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
      return saved;
    }
    const saved = await perform('createSection', { name });
    if (saved) window.dispatchEvent(new CustomEvent('tcanvapro:clear-save-error'));
    return saved;
  }

  return (
    <main className="app-shell" aria-label="Tablero de tareas Tcanvapro">
      <h1 className="sr-only">Tcanvapro Â· Tablero personal de tareas</h1>

      {error && board && !dismissedError && (
        <div className="error-banner" role="alert">
          <span>{error}</span>
          <button type="button" className="text-button" onClick={() => { setDismissedError(true); refresh(); }}>Reintentar</button>
          <button type="button" className="text-button" onClick={() => setDismissedError(true)}>Cerrar</button>
        </div>
      )}

      {loading && <div className="loading-panel" role="status"><span className="loading-dot" /> Cargando tu tableroâ€¦</div>}

      {!loading && board && (
        <Board
          board={board}
          saving={saving}
          onAddTask={(sectionId, task) => perform('createTask', { sectionId, ...task })}
          onRetryTask={(sectionId, task) => perform('createTask', { sectionId, ...task })}
          onMoveTask={moveTask}
          onEditTask={setTaskToEdit}
          onDeleteTask={requestDeleteTask}
          onAddSection={() => setSectionDialog({ section: null })}
          onRenameSection={(section) => setSectionDialog({ section })}
          onMoveSection={(id, position) => perform('moveSection', { id, position })}
          onDeleteSection={requestDeleteSection}
        />
      )}

      {!loading && !board && (
        <section className="storage-error-panel">
          <div className="storage-error-icon" aria-hidden="true">!</div>
          <h2>No pudimos abrir el tablero</h2>
          <p>{error || 'Este navegador necesita permitir almacenamiento local persistente para guardar tus tareas.'}</p>
          <button className="primary-button" type="button" onClick={refresh}>Reintentar</button>
        </section>
      )}

      {taskToEdit && (
        <TaskEditor
          task={taskToEdit}
          saving={saving}
          onClose={() => setTaskToEdit(null)}
          onSave={(payload) => perform('updateTask', payload)}
        />
      )}

      {sectionDialog && (
        <SectionComposer
          section={sectionDialog.section}
          saving={saving}
          onClose={() => setSectionDialog(null)}
          onSave={saveSection}
        />
      )}

      {confirmation?.kind === 'occupied-section' && (
        <ConfirmDialog
          title="Esta secciÃ³n tiene tareas"
          message="Primero mueve o elimina las tareas de esta secciÃ³n. Ninguna tarea se eliminarÃ¡ por borrar la secciÃ³n."
          onClose={() => setConfirmation(null)}
          saving={saving}
        />
      )}
      {(confirmation?.kind === 'task' || confirmation?.kind === 'section') && (
        <ConfirmDialog
          title={confirmation.kind === 'task' ? 'Â¿Eliminar esta tarea?' : 'Â¿Eliminar esta secciÃ³n?'}
          message={confirmation.kind === 'task'
            ? `Se eliminarÃ¡ Â«${confirmation.value.title}Â». Esta acciÃ³n no se puede deshacer.`
            : `Se eliminarÃ¡ la secciÃ³n Â«${confirmation.value.name}Â».`}
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onClose={() => setConfirmation(null)}
          saving={saving}
        />
      )}
    </main>
  );
}
