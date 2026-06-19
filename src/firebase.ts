import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { SetoranDana, MustahikProfile, PenyaluranDana } from './types';

const firebaseConfig = {
  projectId: "gen-lang-client-0007083480",
  appId: "1:433597051461:web:30465357d7bcdc7b3ae92c",
  apiKey: "AIzaSyBCeUgbK5yIeybZQ0jlrsJAKcv-HEBSnPU",
  authDomain: "gen-lang-client-0007083480.firebaseapp.com",
  storageBucket: "gen-lang-client-0007083480.firebasestorage.app",
  messagingSenderId: "433597051461"
};

const app = initializeApp(firebaseConfig);
// Specify the correct firestore custom database ID
export const db = getFirestore(app, "ai-studio-7522bbef-bc6b-48f9-b85b-247f4b1c32fa");

// Collection references
export const setoranCol = collection(db, 'setoran');
export const mustahikCol = collection(db, 'mustahik');
export const penyaluranCol = collection(db, 'penyaluran');

// Initialize security/access codes if don't exist
export async function initializeDefaultRoleCodes(defaultCodes: Record<string, any>) {
  const docRef = doc(db, 'config', 'security');
  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      await setDoc(docRef, { roleCodes: defaultCodes });
    }
  } catch (err) {
    console.error("Error setting default role codes in Firestore:", err);
  }
}

// Real-time synchronization listeners
export function subscribeSetoran(onUpdate: (data: SetoranDana[]) => void) {
  return onSnapshot(setoranCol, (snapshot) => {
    const list: SetoranDana[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({ ...data, id: doc.id } as SetoranDana);
    });
    // Sort by latest added, or maintain stable sort
    onUpdate(list);
  }, (err) => {
    console.error("Setoran subscription error:", err);
  });
}

export function subscribeMustahik(onUpdate: (data: MustahikProfile[]) => void) {
  return onSnapshot(mustahikCol, (snapshot) => {
    const list: MustahikProfile[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({ ...data, id: doc.id } as MustahikProfile);
    });
    onUpdate(list);
  }, (err) => {
    console.error("Mustahik subscription error:", err);
  });
}

export function subscribePenyaluran(onUpdate: (data: PenyaluranDana[]) => void) {
  return onSnapshot(penyaluranCol, (snapshot) => {
    const list: PenyaluranDana[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      list.push({ ...data, id: doc.id } as PenyaluranDana);
    });
    onUpdate(list);
  }, (err) => {
    console.error("Penyaluran subscription error:", err);
  });
}

export function subscribeRoleCodes(onUpdate: (data: Record<string, any>) => void) {
  return onSnapshot(doc(db, 'config', 'security'), (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data().roleCodes || {});
    }
  }, (err) => {
    console.error("RoleCodes subscription error:", err);
  });
}

// Mutator operations
export async function dbAddSetoran(item: SetoranDana) {
  const docRef = doc(db, 'setoran', item.id);
  await setDoc(docRef, item);
}

export async function dbUpdateSetoran(item: SetoranDana) {
  const docRef = doc(db, 'setoran', item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function dbDeleteSetoran(id: string) {
  const docRef = doc(db, 'setoran', id);
  await deleteDoc(docRef);
}

export async function dbAddMustahik(item: MustahikProfile) {
  const docRef = doc(db, 'mustahik', item.id);
  await setDoc(docRef, item);
}

export async function dbUpdateMustahik(item: MustahikProfile) {
  const docRef = doc(db, 'mustahik', item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function dbDeleteMustahik(id: string) {
  const docRef = doc(db, 'mustahik', id);
  await deleteDoc(docRef);
}

export async function dbAddPenyaluran(item: PenyaluranDana) {
  const docRef = doc(db, 'penyaluran', item.id);
  await setDoc(docRef, item);
}

export async function dbUpdatePenyaluran(item: PenyaluranDana) {
  const docRef = doc(db, 'penyaluran', item.id);
  await setDoc(docRef, item, { merge: true });
}

export async function dbDeletePenyaluran(id: string) {
  const docRef = doc(db, 'penyaluran', id);
  await deleteDoc(docRef);
}

export async function dbUpdateRoleCodes(newCodes: Record<string, any>) {
  const docRef = doc(db, 'config', 'security');
  await setDoc(docRef, { roleCodes: newCodes }, { merge: true });
}
