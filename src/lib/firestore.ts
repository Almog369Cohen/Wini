import { getFirestore, collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, onSnapshot, serverTimestamp, type DocumentData, type QueryConstraint } from 'firebase/firestore';
import { auth } from './firebase';

// Initialize Firestore (uses the same Firebase app from firebase.ts)
import { initializeApp, getApps } from 'firebase/app';

const app = getApps()[0] || initializeApp({
  apiKey: "AIzaSyBBUUf6OVq1-fum87PavTpNfsXUsXSa5y8",
  authDomain: "wini-de28d.firebaseapp.com",
  projectId: "wini-de28d",
  storageBucket: "wini-de28d.firebasestorage.app",
  messagingSenderId: "201095133260",
  appId: "1:201095133260:web:02ce115bde1d621f2edce9",
});

export const db = getFirestore(app);

// Helper to get user-scoped collection path
function getUserCollection(collectionName: string): string {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('User not authenticated');
  return `users/${uid}/${collectionName}`;
}

// Generic CRUD operations
export async function fetchCollection<T>(collectionName: string, ...constraints: QueryConstraint[]): Promise<(T & { id: string })[]> {
  const path = getUserCollection(collectionName);
  const q = constraints.length > 0
    ? query(collection(db, path), ...constraints)
    : collection(db, path);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string }));
}

export async function fetchDocument<T>(collectionName: string, docId: string): Promise<(T & { id: string }) | null> {
  const path = getUserCollection(collectionName);
  const docSnap = await getDoc(doc(db, path, docId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
}

export async function createDocument<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
  const path = getUserCollection(collectionName);
  const docRef = await addDoc(collection(db, path), {
    ...data,
    _createdAt: serverTimestamp(),
    _updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateDocument(collectionName: string, docId: string, data: Partial<DocumentData>): Promise<void> {
  const path = getUserCollection(collectionName);
  await updateDoc(doc(db, path, docId), {
    ...data,
    _updatedAt: serverTimestamp(),
  });
}

export async function deleteDocument(collectionName: string, docId: string): Promise<void> {
  const path = getUserCollection(collectionName);
  await deleteDoc(doc(db, path, docId));
}

// Real-time listener
export function subscribeToCollection<T>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  ...constraints: QueryConstraint[]
): () => void {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    callback([]);
    return () => {};
  }
  const path = `users/${uid}/${collectionName}`;
  const q = constraints.length > 0
    ? query(collection(db, path), ...constraints)
    : collection(db, path);

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T & { id: string }));
    callback(data);
  });
}

// Re-export commonly used Firestore functions
export { collection, doc, query, where, orderBy, serverTimestamp, onSnapshot };
