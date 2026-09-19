const STORAGE_KEY = 'soltarte_local_notes';
const LEGACY_STORAGE_KEY = 'cuaderno_local_notes'; // la app se llamaba Cuaderno antes de renombrarse
const listeners = new Set();

// Corre una vez al cargar el módulo: si hay notas guardadas bajo la clave
// vieja y todavía no se migraron, las copia para no perder lo ya escrito.
(function migrateLegacyStorageKey() {
  try {
    if (localStorage.getItem(STORAGE_KEY) !== null) return;
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy !== null) localStorage.setItem(STORAGE_KEY, legacy);
  } catch (err) {
    console.error('Error migrando notas locales', err);
  }
})();

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Error leyendo notas locales', err);
    return [];
  }
}

function writeAll(notes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  listeners.forEach((fn) => fn(notes));
}

export function subscribeLocalNotes(onChange) {
  const handler = (notes) => onChange(notes);
  listeners.add(handler);
  handler(readAll());
  return () => listeners.delete(handler);
}

export function createLocalNote({ title = '', content = '', type = 'otro', formId = null } = {}) {
  const now = Date.now();
  const note = { id: crypto.randomUUID(), title, content, type, formId, createdAt: now, updatedAt: now };
  const notes = readAll();
  notes.push(note);
  writeAll(notes);
  return Promise.resolve(note);
}

export function updateLocalNote(id, changes) {
  const notes = readAll();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return Promise.resolve();
  notes[idx] = { ...notes[idx], ...changes, updatedAt: Date.now() };
  writeAll(notes);
  return Promise.resolve();
}

export function deleteLocalNote(id) {
  writeAll(readAll().filter((n) => n.id !== id));
  return Promise.resolve();
}

export function getLocalNotes() {
  return readAll();
}

export function hasLocalNotes() {
  return readAll().length > 0;
}

export function clearLocalNotes() {
  localStorage.removeItem(STORAGE_KEY);
  listeners.forEach((fn) => fn([]));
}
