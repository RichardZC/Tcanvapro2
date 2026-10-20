let worker;
let sequence = 0;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./sqlite.worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = ({ data }) => {
    const request = pending.get(data.id);
    if (!request) return;
    pending.delete(data.id);
    if (data.ok) request.resolve(data.result);
    else request.reject(new Error(data.error));
  };
  worker.onerror = (event) => {
    const error = new Error(event.message || 'No se pudo abrir el almacenamiento local.');
    pending.forEach((request) => request.reject(error));
    pending.clear();
    worker?.terminate();
    worker = undefined;
  };
  return worker;
}

function request(type, payload = {}) {
  const id = ++sequence;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    try {
      getWorker().postMessage({ id, type, payload });
    } catch (error) {
      pending.delete(id);
      reject(error instanceof Error ? error : new Error('No se pudo guardar el cambio.'));
    }
  });
}

export const boardRepository = {
  getBoard: () => request('getBoard'),
  createTask: (payload) => request('createTask', payload),
  updateTask: (payload) => request('updateTask', payload),
  deleteTask: (payload) => request('deleteTask', payload),
  moveTask: (payload) => request('moveTask', payload),
  createSection: (payload) => request('createSection', payload),
  renameSection: (payload) => request('renameSection', payload),
  moveSection: (payload) => request('moveSection', payload),
  deleteSection: (payload) => request('deleteSection', payload),
};
