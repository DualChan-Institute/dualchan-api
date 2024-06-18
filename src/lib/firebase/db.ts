import type {ServiceAccount} from 'firebase-admin/app';
import {initializeApp, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import serviceAccount from '../../../firebase_auth.json';

// initialisiert die App mit dem Zertifikat aus der lokalen JSON-Datei
initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

// exportiert die Firestore-Datenbank für den Zugriff in anderen Modulen
export const db = getFirestore();
