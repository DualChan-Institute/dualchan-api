import type {Board, BoardDocument} from './Board';
import {db} from '../lib/firebase/db';

/**
 * Definiert den Typ für die Optionen, die beim Abrufen von Boards verwendet werden.
 * @property search - Optionaler Suchbegriff.
 * @property slug - Optionaler Slug.
 * @property limit - Optionale Begrenzung der Anzahl der zurückgegebenen Boards.
 * @property offset - Optionale Offset zum Überspringen einer bestimmten Anzahl von Boards.
 */
type FindBoardsOptions = {
  search?: string;
  slug?: string;
  limit?: number;
  offset?: number;
};

/**
 * Findet Boards basierend auf den bereitgestellten Optionen.
 * @param search - Optionaler Suchbegriff.
 * @param slug - Optionaler Slug.
 * @param limit - Optionales Limit für die Anzahl der zurückgegebenen Boards.
 * @param offset - Optionales Offset zum Überspringen einer bestimmten Anzahl von Boards.
 * @returns Eine Liste von Board-Dokumenten.
 */
export async function findBoards({
  search,
  slug,
  limit,
  offset,
}: FindBoardsOptions): Promise<BoardDocument[]> {
  const collection = db.collection('boards');
  let query = collection.orderBy('slug');
  if (search) {
    query = query.where('name', '==', search);
  }
  if (slug) {
    query = query.where('slug', '==', slug);
  }
  if (limit) {
    query = query.limit(limit);
  }
  if (offset) {
    query = query.offset(offset);
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => {
    const data = doc.data() as BoardDocument;
    data.id = doc.id;
    return data;
  });
}

/**
 * Definiert den Typ für die Optionen, die beim Abrufen eines einzelnen Boards verwendet werden.
 * @property id - Die ID des Boards, das abgerufen werden soll.
 */
type FindBoardOptions = {
  id: string;
};

/**
 * Findet ein einzelnes Board basierend auf der Board-ID.
 * @param id - Die ID des Boards, das abgerufen werden soll.
 * @returns Das Board-Dokument.
 */
export async function findBoard({
  id,
}: FindBoardOptions): Promise<BoardDocument> {
  const doc = await db.collection('boards').doc(id).get();
  const data = doc.data() as BoardDocument;
  data.id = doc.id;
  return data;
}

/**
 * Definiert den Typ für die Optionen, die beim Aktualisieren eines Boards verwendet werden.
 * @property id - Die ID des Boards, das aktualisiert werden soll.
 * @property board - Die neuen Board-Daten.
 */
type UpdateBoardOptions = {
  id: string;
  board: Board | BoardDocument;
};

/**
 * Aktualisiert die Informationen eines bestehenden Boards.
 * @param id - Die ID des Boards, das aktualisiert werden soll.
 * @param board - Die neuen Board-Daten.
 * @returns Das aktualisierte Board-Dokument.
 */
export async function updateBoard({
  id,
  board,
}: UpdateBoardOptions): Promise<BoardDocument> {
  await db.collection('boards').doc(id).set(board);
  return findBoard({id});
}

/**
 * Definiert den Typ für die Optionen, die beim Erstellen eines neuen Boards verwendet werden.
 * @property board - Die Daten des neuen Boards.
 */
type CreateBoardOptions = {
  board: Board;
};

/**
 * Erstellt ein neues Board.
 * @param board - Die Daten des neuen Boards.
 * @returns Das neu erstellte Board-Dokument.
 */
export async function createBoard({
  board,
}: CreateBoardOptions): Promise<BoardDocument> {
  const newBoard = await db.collection('boards').add(board);
  const doc = await newBoard.get();
  return doc.data() as BoardDocument;
}

/**
 * Löscht ein Board basierend auf der Board-ID.
 * @param id - Die ID des Boards, das gelöscht werden soll.
 */
export async function removeBoard({id}: FindBoardOptions): Promise<void> {
  await db.collection('boards').doc(id).delete();
}
