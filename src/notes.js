import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.js';

const notesRef = (uid) => collection(db, 'users', uid, 'notes');

export function subscribeNotes(uid, onChange, onError) {
  const q = query(notesRef(uid), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snapshot) => {
      const notes = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(notes);
    },
    onError,
  );
}

export function createNote(uid, { title = '', content = '', type = 'otro', formId = null } = {}) {
  return addDoc(notesRef(uid), {
    title,
    content,
    type,
    formId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateNote(uid, id, changes) {
  return updateDoc(doc(db, 'users', uid, 'notes', id), {
    ...changes,
    updatedAt: serverTimestamp(),
  });
}

export function deleteNote(uid, id) {
  return deleteDoc(doc(db, 'users', uid, 'notes', id));
}
