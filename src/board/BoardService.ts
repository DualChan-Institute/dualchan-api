import type {Board, BoardDocument} from './Board';
import {db} from '../db';

type FindBoardsOptions = {
  search?: string;
  slug?: string;
  limit?: number;
  offset?: number;
};
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

type FindBoardOptions = {
  id: string;
};
export async function findBoard({
  id,
}: FindBoardOptions): Promise<BoardDocument> {
  const doc = await db.collection('boards').doc(id).get();
  const data = doc.data() as BoardDocument;
  data.id = doc.id;
  return data;
}

type UpdateBoardOptions = {
  id: string;
  board: Board | BoardDocument;
};
export async function updateBoard({
  id,
  board,
}: UpdateBoardOptions): Promise<BoardDocument> {
  await db.collection('boards').doc(id).set(board);
  return findBoard({id});
}

type CreateBoardOptions = {
  board: Board;
};
export async function createBoard({
  board,
}: CreateBoardOptions): Promise<BoardDocument> {
  const newBoard = await db.collection('boards').add(board);
  const doc = await newBoard.get();
  return doc.data() as BoardDocument;
}

export async function removeBoard({id}: FindBoardOptions): Promise<void> {
  await db.collection('boards').doc(id).delete();
}
