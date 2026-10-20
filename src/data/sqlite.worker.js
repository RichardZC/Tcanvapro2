import sqlite3InitModule from '@sqlite.org/sqlite-wasm';

let database;
let initialization;
let queue = Promise.resolve();

const SECTIONS = ['Asignadas recientemente', 'En proceso', 'Terminado'];

function rows(sql, bind = []) {
  const resultRows = [];
  database.exec({ sql, bind, rowMode: 'object', resultRows });
  return resultRows;
}

function run(sql, bind = []) {
  database.exec({ sql, bind });
}

function transaction(action) {
  run('BEGIN IMMEDIATE');
  try {
    const result = action();
    run('COMMIT');
    return result;
  } catch (error) {
    run('ROLLBACK');
    throw error;
  }
}

async function initialize() {
  if (initialization) return initialization;
  const attempt = (async () => {
    if (!self.isSecureContext || !navigator.storage?.getDirectory) {
      throw new Error('El almacenamiento local persistente no estÃ¡ disponible en este navegador.');
    }

    const sqlite3 = await sqlite3InitModule();
    const pool = await sqlite3.installOpfsSAHPoolVfs({
      name: 'tcanvapro',
      directory: '/tcanvapro',
      initialCapacity: 6,
      preserveOnInitFailure: true,
    });
    database = new pool.OpfsSAHPoolDb('/tcanvapro.sqlite3');
    run('PRAGMA foreign_keys = ON');
    run(`
      CREATE TABLE IF NOT EXISTS sections (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL CHECK (length(trim(name)) > 0),
        position INTEGER NOT NULL CHECK (position >= 0)
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL CHECK (length(trim(title)) > 0),
        description TEXT,
        due_date TEXT,
        section_id INTEGER NOT NULL REFERENCES sections(id) ON DELETE RESTRICT,
        position INTEGER NOT NULL CHECK (position >= 0)
      );
      CREATE INDEX IF NOT EXISTS tasks_section_order ON tasks(section_id, position);
    `);

    const schemaVersion = database.selectValue('PRAGMA user_version');
    if (schemaVersion === 0) {
      transaction(() => {
        SECTIONS.forEach((name, position) => {
          run('INSERT INTO sections (name, position) VALUES (?, ?)', [name, position]);
        });
        run('PRAGMA user_version = 1');
      });
    }
  })();
  initialization = attempt.catch((error) => {
    initialization = undefined;
    throw error;
  });
  return initialization;
}

function getBoard() {
  return {
    sections: rows('SELECT id, name, position FROM sections ORDER BY position, id'),
    tasks: rows(`
      SELECT id, title, description, due_date AS dueDate, section_id AS sectionId, position
      FROM tasks
      ORDER BY section_id, position, id
    `),
  };
}

function compactPositions(sectionId, taskIds) {
  taskIds.forEach((id, position) => {
    run('UPDATE tasks SET section_id = ?, position = ? WHERE id = ?', [sectionId, position, id]);
  });
}

function createTask({ title, sectionId, description = '', dueDate = null }) {
  const cleanTitle = String(title ?? '').trim();
  if (!cleanTitle) throw new Error('Escribe el nombre de la tarea.');
  const section = rows('SELECT id FROM sections WHERE id = ?', [sectionId])[0];
  if (!section) throw new Error('No se encontrÃ³ la secciÃ³n de destino.');
  const position = Number(database.selectValue('SELECT COUNT(*) FROM tasks WHERE section_id = ?', [sectionId]));
  run('INSERT INTO tasks (title, description, due_date, section_id, position) VALUES (?, ?, ?, ?, ?)', [
    cleanTitle,
    String(description ?? '').trim() || null,
    dueDate || null,
    sectionId,
    position,
  ]);
  return getBoard();
}

function updateTask({ id, title, description, dueDate }) {
  const cleanTitle = String(title ?? '').trim();
  if (!cleanTitle) throw new Error('Escribe el nombre de la tarea.');
  run('UPDATE tasks SET title = ?, description = ?, due_date = ? WHERE id = ?', [
    cleanTitle,
    String(description ?? '').trim() || null,
    dueDate || null,
    id,
  ]);
  return getBoard();
}

function deleteTask({ id }) {
  const task = rows('SELECT section_id AS sectionId, position FROM tasks WHERE id = ?', [id])[0];
  if (!task) return getBoard();
  transaction(() => {
    run('DELETE FROM tasks WHERE id = ?', [id]);
    const remainder = rows('SELECT id FROM tasks WHERE section_id = ? ORDER BY position, id', [task.sectionId]);
    compactPositions(task.sectionId, remainder.map((row) => row.id));
  });
  return getBoard();
}

function moveTask({ id, sectionId, position }) {
  const current = rows('SELECT section_id AS sectionId FROM tasks WHERE id = ?', [id])[0];
  if (!current) throw new Error('No se encontrÃ³ la tarea que quieres mover.');
  if (!rows('SELECT id FROM sections WHERE id = ?', [sectionId])[0]) {
    throw new Error('No se encontrÃ³ la secciÃ³n de destino.');
  }

  if (current.sectionId === sectionId) {
    const currentIds = rows('SELECT id FROM tasks WHERE section_id = ? ORDER BY position, id', [sectionId]).map((row) => row.id);
    const oldIndex = currentIds.indexOf(id);
    const requestedIndex = Math.max(0, Math.min(Number(position) || 0, currentIds.length - 1));
    if (oldIndex === requestedIndex) return getBoard();
  }

  transaction(() => {
    const sourceIds = rows('SELECT id FROM tasks WHERE section_id = ? ORDER BY position, id', [current.sectionId])
      .map((row) => row.id)
      .filter((taskId) => taskId !== id);
    const targetIds = current.sectionId === sectionId
      ? sourceIds
      : rows('SELECT id FROM tasks WHERE section_id = ? ORDER BY position, id', [sectionId]).map((row) => row.id);
    const insertionIndex = Math.max(0, Math.min(Number(position) || 0, targetIds.length));
    targetIds.splice(insertionIndex, 0, id);

    if (current.sectionId !== sectionId) compactPositions(current.sectionId, sourceIds);
    compactPositions(sectionId, targetIds);
  });
  return getBoard();
}

function createSection({ name }) {
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new Error('Escribe el nombre de la secciÃ³n.');
  const position = Number(database.selectValue('SELECT COUNT(*) FROM sections'));
  run('INSERT INTO sections (name, position) VALUES (?, ?)', [cleanName, position]);
  return getBoard();
}

function renameSection({ id, name }) {
  const cleanName = String(name ?? '').trim();
  if (!cleanName) throw new Error('Escribe el nombre de la secciÃ³n.');
  run('UPDATE sections SET name = ? WHERE id = ?', [cleanName, id]);
  return getBoard();
}

function moveSection({ id, position }) {
  if (!rows('SELECT id FROM sections WHERE id = ?', [id])[0]) throw new Error('No se encontrÃ³ la secciÃ³n.');
  transaction(() => {
    const sectionIds = rows('SELECT id FROM sections ORDER BY position, id')
      .map((row) => row.id)
      .filter((sectionId) => sectionId !== id);
    const insertionIndex = Math.max(0, Math.min(Number(position) || 0, sectionIds.length));
    sectionIds.splice(insertionIndex, 0, id);
    sectionIds.forEach((sectionId, nextPosition) => {
      run('UPDATE sections SET position = ? WHERE id = ?', [nextPosition, sectionId]);
    });
  });
  return getBoard();
}

function deleteSection({ id }) {
  const count = Number(database.selectValue('SELECT COUNT(*) FROM tasks WHERE section_id = ?', [id]));
  if (count > 0) throw new Error('Primero mueve o elimina las tareas de esta secciÃ³n.');
  transaction(() => {
    run('DELETE FROM sections WHERE id = ?', [id]);
    const ids = rows('SELECT id FROM sections ORDER BY position, id').map((row) => row.id);
    ids.forEach((sectionId, position) => run('UPDATE sections SET position = ? WHERE id = ?', [position, sectionId]));
  });
  return getBoard();
}

const operations = {
  getBoard,
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  createSection,
  renameSection,
  moveSection,
  deleteSection,
};

self.onmessage = (event) => {
  const request = event.data;
  queue = queue.then(async () => {
    try {
      await initialize();
      const operation = operations[request.type];
      if (!operation) throw new Error('La operaciÃ³n solicitada no estÃ¡ disponible.');
      self.postMessage({ id: request.id, ok: true, result: operation(request.payload ?? {}) });
    } catch (error) {
      self.postMessage({
        id: request.id,
        ok: false,
        error: error instanceof Error ? error.message : 'No se pudo guardar el cambio.',
      });
    }
  });
};
