import { subscribeNotes, createNote, updateNote, deleteNote } from '../notes.js';
import { getFormById, buildTemplateContent } from '../forms-data.js';
import { countLineSyllables } from '../syllables.js';

export const TYPE_LABELS = { cancion: 'Canción', poema: 'Poema', otro: 'Otro' };
const TYPE_ICONS = { cancion: '🎵', poema: '📝', otro: '📄' };
const SAVE_DELAY = 700;

const state = {
  user: null,
  unsubscribe: null,
  notes: [],
  selectedId: null,
  localPatch: null, // { id, title, content, type }
  saveTimer: null,
  search: '',
  typeFilter: 'todos',
  sortBy: 'updatedAt', // 'updatedAt' | 'createdAt'
};

function el(container, selector) {
  return container.querySelector(selector);
}

export function mountNotesView(container, user) {
  state.user = user;
  state.notes = [];
  state.selectedId = null;
  state.localPatch = null;

  container.innerHTML = `
    <div class="notes-layout">
      <div class="notes-browser">
        <div class="sidebar-toolbar">
          <input type="search" id="notes-search" placeholder="Buscar en tus escritos..." />
          <div class="toolbar-row">
            <div class="type-filters" role="tablist">
              <button class="chip is-active" data-type="todos">Todos</button>
              <button class="chip" data-type="cancion">Canciones</button>
              <button class="chip" data-type="poema">Poemas</button>
              <button class="chip" data-type="otro">Otros</button>
            </div>
            <select id="notes-sort" class="select-control">
              <option value="updatedAt">Última edición</option>
              <option value="createdAt">Fecha de creación</option>
            </select>
          </div>
        </div>
        <div id="notes-grid" class="notes-grid"></div>
      </div>
      <section class="editor-pane" id="editor-pane">
        <div class="editor-empty" id="editor-empty">
          <p>Elegí un escrito de la lista o creá uno nuevo.</p>
        </div>
      </section>
      <button id="new-note-fab" class="fab" title="Nuevo escrito" aria-label="Nuevo escrito">+</button>
    </div>
  `;

  el(container, '#notes-search').addEventListener('input', (e) => {
    state.search = e.target.value.toLowerCase();
    renderGrid(container);
  });

  container.querySelectorAll('.type-filters .chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.typeFilter = btn.dataset.type;
      container.querySelectorAll('.type-filters .chip').forEach((b) => b.classList.toggle('is-active', b === btn));
      renderGrid(container);
    });
  });

  el(container, '#notes-sort').addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderGrid(container);
  });

  el(container, '#new-note-fab').addEventListener('click', () => handleCreate(container));

  state.unsubscribe = subscribeNotes(
    user.uid,
    (notes) => {
      state.notes = notes;
      renderGrid(container);
      if (state.selectedId && !state.localPatch) {
        const current = notes.find((n) => n.id === state.selectedId);
        if (current) renderEditor(container, current);
      }
    },
    (err) => console.error('Error escuchando notas', err),
  );
}

export function getNotesSnapshot() {
  return state.notes;
}

export function unmountNotesView() {
  if (state.saveTimer) clearTimeout(state.saveTimer);
  if (state.unsubscribe) state.unsubscribe();
  state.unsubscribe = null;
  state.user = null;
  state.notes = [];
  state.selectedId = null;
  state.localPatch = null;
}

function timestampMs(ts) {
  // Un serverTimestamp() recién escrito llega null hasta que el server lo
  // confirma - lo tratamos como "ahora" para que la nota no salte al final
  // de la lista durante ese instante.
  return ts?.toMillis ? ts.toMillis() : Date.now();
}

function formatDate(ts) {
  if (!ts?.toDate) return 'Guardando...';
  return ts.toDate().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function filteredNotes() {
  const filtered = state.notes.filter((n) => {
    if (state.typeFilter !== 'todos' && n.type !== state.typeFilter) return false;
    if (!state.search) return true;
    const haystack = `${n.title} ${n.content}`.toLowerCase();
    return haystack.includes(state.search);
  });
  return filtered.sort((a, b) => timestampMs(b[state.sortBy]) - timestampMs(a[state.sortBy]));
}

function displayNote(note) {
  if (state.localPatch && state.localPatch.id === note.id) {
    return { ...note, ...state.localPatch };
  }
  return note;
}

function renderGrid(container) {
  const grid = el(container, '#notes-grid');
  const notes = filteredNotes();

  if (!notes.length) {
    grid.innerHTML = `<p class="notes-list-empty">No hay escritos todavía. ¡Empezá uno nuevo!</p>`;
    return;
  }

  grid.innerHTML = notes
    .map((rawNote) => {
      const note = displayNote(rawNote);
      const title = note.title?.trim() || 'Sin título';
      const preview = (note.content || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      const isActive = note.id === state.selectedId;
      const dateLabel = state.sortBy === 'createdAt' ? `Creado: ${formatDate(note.createdAt)}` : `Editado: ${formatDate(note.updatedAt)}`;
      return `
        <button class="note-card ${isActive ? 'is-active' : ''}" data-id="${note.id}">
          <span class="note-card-header">
            <span class="note-card-title">${escapeHtml(title)}</span>
            <span class="note-item-type">${TYPE_LABELS[note.type] || 'Otro'}</span>
          </span>
          <span class="note-card-preview">${escapeHtml(preview)}</span>
          <span class="note-card-date">${dateLabel}</span>
        </button>
      `;
    })
    .join('');

  grid.querySelectorAll('.note-card').forEach((btn) => {
    btn.addEventListener('click', () => selectNote(container, btn.dataset.id));
  });
}

function selectNote(container, id) {
  flushSave();
  state.selectedId = id;
  state.localPatch = null;
  const note = state.notes.find((n) => n.id === id);
  if (note) renderEditor(container, note);
  renderGrid(container);
}

async function handleCreate(container) {
  const ref = await createNote(state.user.uid, { title: '', content: '', type: 'otro' });
  state.selectedId = ref.id;
  state.localPatch = null;
}

export async function createNoteFromTemplate(form) {
  if (!state.user) return;
  const ref = await createNote(state.user.uid, {
    title: form.name,
    content: buildTemplateContent(form),
    type: form.id === 'letra-cancion' ? 'cancion' : 'poema',
    formId: form.id,
  });
  state.selectedId = ref.id;
  state.localPatch = null;
}

function renderEditor(container, note) {
  const pane = el(container, '#editor-pane');
  const form = note.formId ? getFormById(note.formId) : null;
  let currentType = note.type;

  pane.innerHTML = `
    <div class="editor-toolbar">
      <button class="btn btn-ghost icon-btn" id="back-to-list" title="Volver" aria-label="Volver">←</button>
      <input type="text" id="note-title" class="note-title-input" placeholder="Título" value="${escapeAttr(note.title || '')}" />
      <div class="type-toggle" role="group" aria-label="Tipo de escrito">
        ${Object.keys(TYPE_LABELS)
          .map(
            (t) =>
              `<button type="button" class="type-toggle-btn ${t === currentType ? 'is-active' : ''}" data-type-toggle="${t}" title="${TYPE_LABELS[t]}" aria-label="${TYPE_LABELS[t]}">${TYPE_ICONS[t]}</button>`,
          )
          .join('')}
      </div>
      <button class="btn btn-ghost btn-danger icon-btn" id="delete-note" title="Eliminar" aria-label="Eliminar">🗑️</button>
    </div>
    ${form ? `<div class="form-hint">Escribiendo con la forma <strong>${form.name}</strong> · ${form.scheme}</div>` : ''}
    <textarea id="note-content" class="note-content-textarea" placeholder="Empezá a escribir...">${escapeHtml(note.content || '')}</textarea>
    ${form && form.template.syllableTargets ? '<div id="syllable-hints" class="syllable-hints"></div>' : ''}
    <div class="save-status" id="save-status"></div>
  `;

  document.querySelector('.notes-layout')?.classList.add('show-editor');

  const titleInput = el(pane, '#note-title');
  const contentArea = el(pane, '#note-content');
  const saveStatus = el(pane, '#save-status');

  function onEdit() {
    state.localPatch = {
      id: note.id,
      title: titleInput.value,
      content: contentArea.value,
      type: currentType,
    };
    renderGrid(container);
    if (form && form.template.syllableTargets) updateSyllableHints(pane, form);
    saveStatus.textContent = 'Guardando…';
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => flushSave(saveStatus), SAVE_DELAY);
  }

  titleInput.addEventListener('input', onEdit);
  contentArea.addEventListener('input', onEdit);

  pane.querySelectorAll('[data-type-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentType = btn.dataset.typeToggle;
      pane.querySelectorAll('[data-type-toggle]').forEach((b) => b.classList.toggle('is-active', b === btn));
      onEdit();
    });
  });

  el(pane, '#delete-note').addEventListener('click', async () => {
    if (!confirm('¿Eliminar este escrito? No se puede deshacer.')) return;
    await deleteNote(state.user.uid, note.id);
    state.selectedId = null;
    state.localPatch = null;
    pane.innerHTML = `<div class="editor-empty"><p>Elegí un escrito de la lista o creá uno nuevo.</p></div>`;
    document.querySelector('.notes-layout')?.classList.remove('show-editor');
  });

  el(pane, '#back-to-list').addEventListener('click', () => {
    document.querySelector('.notes-layout')?.classList.remove('show-editor');
  });

  if (form && form.template.syllableTargets) updateSyllableHints(pane, form);
}

function updateSyllableHints(pane, form) {
  const hintsEl = el(pane, '#syllable-hints');
  if (!hintsEl) return;
  const lines = el(pane, '#note-content').value.split('\n');
  const targets = form.template.syllableTargets;
  const rows = targets
    .map((target, i) => {
      const line = (lines[i] || '').replace(/^\(\d+ sílabas\)\s*/, '');
      const count = countLineSyllables(line);
      const ok = count === target;
      return `<span class="syllable-row ${ok ? 'ok' : ''}">Verso ${i + 1}: ${count}/${target}</span>`;
    })
    .join('');
  hintsEl.innerHTML = rows;
}

function flushSave(statusEl) {
  if (state.saveTimer) {
    clearTimeout(state.saveTimer);
    state.saveTimer = null;
  }
  if (!state.localPatch || !state.user) return;
  const { id, ...changes } = state.localPatch;
  updateNote(state.user.uid, id, changes)
    .then(() => {
      if (state.localPatch && state.localPatch.id === id) state.localPatch = null;
      if (statusEl) statusEl.textContent = 'Guardado';
    })
    .catch((err) => {
      console.error('Error guardando nota', err);
      if (statusEl) statusEl.textContent = 'No se pudo guardar';
    });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}
