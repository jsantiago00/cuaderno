import { Timestamp } from 'firebase/firestore';
import { createNote } from './notes.js';
import { getLocalNotes, clearLocalNotes } from './local-notes.js';

// Sube las notas guardadas en localStorage a la cuenta recién logueada,
// preservando las fechas originales, y limpia el storage local si todo sale bien.
export async function syncLocalNotesToCloud(uid) {
  const localNotes = getLocalNotes();
  if (!localNotes.length) return;

  await Promise.all(
    localNotes.map((note) =>
      createNote(uid, {
        title: note.title,
        content: note.content,
        type: note.type,
        formId: note.formId,
        createdAt: Timestamp.fromMillis(note.createdAt || Date.now()),
        updatedAt: Timestamp.fromMillis(note.updatedAt || Date.now()),
      }),
    ),
  );

  clearLocalNotes();
}
