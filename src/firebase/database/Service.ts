import type {ServiceAccount} from 'firebase-admin/app';
import {initializeApp, applicationDefault, cert} from 'firebase-admin/app';
import {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} from 'firebase-admin/firestore';

import serviceAccount from '../../../firebase_auth.json';

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

// start the garbage collector
const gc = getFirestore().collection('garbage');
gc.doc('collector').set({timestamp: FieldValue.serverTimestamp()});

export const db = getFirestore();
