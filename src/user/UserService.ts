import {db} from '../lib/firebase/db';
import type {User, UserDocument} from './User';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Liest das JWT_SECRET aus den Umgebungsvariablen.
 * Wenn kein JWT_SECRET vorhanden ist, wird null zugewiesen.
 */
const JWT_SECRET = process.env.JWT_SECRET || null;

/**
 * Definiert den Typ für die Suchoptionen, die beim Abrufen von Benutzern verwendet werden.
 * @property search - Optionaler Suchbegriff.
 * @property email - Optionale E-Mail-Adresse.
 * @property limit - Optionale Begrenzung der Anzahl der zurückgegebenen Benutzer.
 * @property offset - Optionale Offset zum Überspringen einer bestimmten Anzahl von Benutzern.
 */
type FindUsersOptions = {
  search?: string;
  email?: string;
  limit?: number;
  offset?: number;
};

/**
 * Findet Benutzer basierend auf den bereitgestellten Optionen.
 * @param search - Optionaler Suchbegriff.
 * @param email - Optionale E-Mail-Adresse.
 * @param limit - Optionales Limit für die Anzahl der zurückgegebenen Benutzer.
 * @param offset - Optionales Offset zum Überspringen einer bestimmten Anzahl von Benutzern.
 * @returns Eine Liste von Benutzerdokumenten.
 */
export async function findUsers({
  search,
  email,
  limit,
  offset,
}: FindUsersOptions): Promise<UserDocument[]> {
  const collection = db.collection('users');
  let query = collection.orderBy('email');
  if (search) {
    query = query.where('email', '==', search);
  }
  if (email) {
    query = query.where('email', '==', email);
  }
  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.offset(offset);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as UserDocument;
    data.id = doc.id;
    return data;
  });
}

/**
 * Definiert den Typ für die Optionen, die beim Abrufen eines einzelnen Benutzers verwendet werden.
 * @property id - Die ID des Benutzers, der abgerufen werden soll.
 */
type FindUserOptions = {
  id: string;
};

/**
 * Findet einen einzelnen Benutzer basierend auf der Benutzer-ID.
 * @param id - Die ID des Benutzers, der abgerufen werden soll.
 * @returns Das Benutzerdokument.
 */
export async function findUser({id}: FindUserOptions): Promise<UserDocument> {
  const doc = await db.collection('users').doc(id).get();

  if (!doc.exists) {
    throw new Error(`User with id ${id} not found`);
  }

  const data = doc.data() as UserDocument;
  data.id = doc.id;
  return data;
}

/**
 * Definiert den Typ für die Optionen, die beim Aktualisieren eines Benutzers verwendet werden.
 * @property id - Die ID des Benutzers, der aktualisiert werden soll.
 * @property user - Die neuen Benutzerdaten.
 */
type UpdateUserOptions = {
  id: string;
  user: User | UserDocument;
};

/**
 * Aktualisiert die Informationen eines bestehenden Benutzers.
 * @param id - Die ID des Benutzers, der aktualisiert werden soll.
 * @param user - Die neuen Benutzerdaten.
 * @returns Das aktualisierte Benutzerdokument.
 */
export async function updateUser({
  id,
  user,
}: UpdateUserOptions): Promise<UserDocument> {
  await db.collection('users').doc(id).set(user);
  return findUser({id});
}

/**
 * Definiert den Typ für die Optionen, die beim Erstellen eines neuen Benutzers verwendet werden.
 * @property user - Die Daten des neuen Benutzers.
 */
type CreateUserOptions = {
  user: User;
};

/**
 * Erstellt einen neuen Benutzer.
 * @param user - Die Daten des neuen Benutzers.
 * @returns Das neu erstellte Benutzerdokument.
 */
export async function createUser({
  user,
}: CreateUserOptions): Promise<UserDocument> {
  const password = await bcrypt.hash(user.password, 10);
  const newUser = await db.collection('users').add({...user, password});
  const data = (await newUser.get()).data() as UserDocument;
  data.id = newUser.id;
  return data;
}

/**
 * Löscht einen Benutzer basierend auf der Benutzer-ID.
 * @param id - Die ID des Benutzers, der gelöscht werden soll.
 */
export async function removeUser({id}: FindUserOptions) {
  if (!(await findUser({id}))) {
    throw new Error(`User with id ${id} not found`);
  }

  await db.collection('users').doc(id).delete();
}

/**
 * Überprüft, ob eine E-Mail-Adresse bereits registriert ist.
 * @param email - Die zu überprüfende E-Mail-Adresse.
 * @returns Ein boolean-Wert, der angibt, ob die E-Mail-Adresse registriert ist.
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const snapshot = await db
    .collection('users')
    .where('email', '==', email)
    .limit(1)
    .get();
  return !snapshot.empty;
}
