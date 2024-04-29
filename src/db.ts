import type {ServiceAccount} from 'firebase-admin/app';
import {initializeApp, applicationDefault, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import serviceAccount from '../firebase_auth.json';

export const usingMongoose = false;

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const db = getFirestore();
