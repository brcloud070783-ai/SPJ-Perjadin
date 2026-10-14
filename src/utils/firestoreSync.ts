import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  collection, 
  getDocs, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { ProjectSPJ } from '../types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

const COLLECTION_NAME = 'spj_projects';

/**
 * Save or sync a single SPJ Project to Firestore Cloud for live updates
 */
export const syncProjectToFirestore = async (project: ProjectSPJ, shareCode?: string): Promise<string> => {
  try {
    const docId = shareCode?.trim() || project.id;
    const docRef = doc(db, COLLECTION_NAME, docId);

    const payload = {
      ...project,
      lastSyncedAt: Date.now(),
      updatedAtServer: serverTimestamp()
    };

    await setDoc(docRef, payload, { merge: true });
    return docId;
  } catch (error: any) {
    console.error('Firestore sync error:', error);
    throw new Error(error.message || 'Gagal menyinkronkan data ke Cloud Firestore.');
  }
};

/**
 * Download a project from Firestore by ID or Share Code
 */
export const fetchProjectFromFirestore = async (docId: string): Promise<ProjectSPJ | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as ProjectSPJ;
    }
    return null;
  } catch (error: any) {
    console.error('Firestore fetch error:', error);
    throw new Error('Gagal mengambil data SPJ dari Firestore.');
  }
};

/**
 * Subscribe to real-time live updates for a given SPJ Project ID or Share Code.
 * When data changes on Laptop, callback is called on Mobile immediately!
 */
export const subscribeToProjectLiveSync = (
  docId: string, 
  onUpdate: (project: ProjectSPJ) => void,
  onError?: (err: any) => void
) => {
  const docRef = doc(db, COLLECTION_NAME, docId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as ProjectSPJ;
        onUpdate(data);
      }
    },
    (err) => {
      console.error('Live sync error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Delete a project from Firestore Cloud
 */
export const deleteProjectFromFirestore = async (docId: string): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, docId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('Firestore delete error:', error);
    throw new Error('Gagal menghapus project dari Firestore Cloud.');
  }
};
