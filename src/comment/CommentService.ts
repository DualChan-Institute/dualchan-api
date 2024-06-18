import type {Comment, CommentDocument} from './Comment';
import {db} from '../lib/firebase/db';

/**
 * Definiert den Typ für die Optionen, die beim Abrufen von Kommentaren verwendet werden.
 * @property parentId - Optionaler übergeordneter ID-Filter.
 * @property limit - Optionale Begrenzung der Anzahl der zurückgegebenen Kommentare.
 * @property offset - Optionale Offset zum Überspringen einer bestimmten Anzahl von Kommentaren.
 */
type FindCommentsOptions = {
  parentId?: string;
  limit?: number;
  offset?: number;
};

/**
 * Findet Kommentare basierend auf den bereitgestellten Optionen.
 * @param parentId - Optionaler übergeordneter ID-Filter.
 * @param limit - Optionales Limit für die Anzahl der zurückgegebenen Kommentare.
 * @param offset - Optionales Offset zum Überspringen einer bestimmten Anzahl von Kommentaren.
 * @returns Eine Liste von Kommentardokumenten.
 */
export async function findComments({
  parentId,
  limit,
  offset,
}: FindCommentsOptions): Promise<CommentDocument[]> {
  const collection = db.collection('comments');
  let query = collection.orderBy('parentId');
  if (parentId) {
    query = query.where('parentId', '==', parentId);
  }
  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.offset(offset);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as CommentDocument;
    data.id = doc.id;
    return data;
  });
}

/**
 * Definiert den Typ für die Optionen, die beim Abrufen eines einzelnen Kommentars verwendet werden.
 * @property id - Die ID des Kommentars, der abgerufen werden soll.
 */
type FindCommentOptions = {
  id: string;
};

/**
 * Findet einen einzelnen Kommentar basierend auf der Kommentar-ID.
 * @param id - Die ID des Kommentars, der abgerufen werden soll.
 * @returns Das Kommentardokument.
 */
export async function findComment({
  id,
}: FindCommentOptions): Promise<CommentDocument> {
  const doc = await db.collection('comments').doc(id).get();

  if (!doc.exists) {
    throw new Error(`Comment with id ${id} not found`);
  }

  const data = doc.data() as CommentDocument;
  data.id = doc.id;
  return data;
}

/**
 * Definiert den Typ für die Optionen, die beim Aktualisieren eines Kommentars verwendet werden.
 * @property id - Die ID des Kommentars, der aktualisiert werden soll.
 * @property comment - Die neuen Kommentar-Daten.
 */
type UpdateCommentOptions = {
  id: string;
  comment: Comment | CommentDocument;
};

/**
 * Aktualisiert die Informationen eines bestehenden Kommentars.
 * @param id - Die ID des Kommentars, der aktualisiert werden soll.
 * @param comment - Die neuen Kommentar-Daten.
 * @returns Das aktualisierte Kommentardokument.
 */
export async function updateComment({
  id,
  comment,
}: UpdateCommentOptions): Promise<CommentDocument> {
  await db.collection('comments').doc(id).set(comment);
  return findComment({id});
}

/**
 * Definiert den Typ für die Optionen, die beim Erstellen eines neuen Kommentars verwendet werden.
 * @property comment - Die Daten des neuen Kommentars.
 */
type CreateCommentOptions = {
  comment: Comment;
};

/**
 * Erstellt einen neuen Kommentar.
 * @param comment - Die Daten des neuen Kommentars.
 * @returns Das neu erstellte Kommentardokument.
 */
export async function createComment({
  comment,
}: CreateCommentOptions): Promise<CommentDocument> {
  const newComment = await db.collection('comments').add(comment);
  const doc = await newComment.get();
  return doc.data() as CommentDocument;
}

/**
 * Löscht einen Kommentar basierend auf der Kommentar-ID.
 * @param id - Die ID des Kommentars, der gelöscht werden soll.
 */
export async function removeComment({id}: FindCommentOptions): Promise<void> {
  if (!(await findComment({id}))) {
    throw new Error(`Comment with id ${id} not found`);
  }

  await db.collection('comments').doc(id).delete();
}
