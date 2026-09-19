const STORAGE_KEY = 'cuaderno_local_notes';
const listeners = new Set();

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

function sortByUpdated(notes) {
  return [...notes].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function subscribeLocalNotes(onChange) {
  const handler = (notes) => onChange(sortByUpdated(notes));
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
