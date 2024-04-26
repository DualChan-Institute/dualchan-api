import type Board from '../../types/Board';
import type PaginationSettings from '../../types/PaginationSettings';
import {deleteRelations, getRelations} from './RelationService';
import {db} from './Service';

// function to get all boards (add pagination settings, because we cannot return all boards at once)
async function getBoards(
  paginationSettings: PaginationSettings,
): Promise<Board[]> {
  const snapshot = await db.collection('boards').get();
  const boards: Board[] = [];
  snapshot.forEach((doc) => {
    boards.push(doc.data() as Board);
  });
  return boards;
}

// function to get a specific board
async function getBoard(id: string): Promise<Board | null> {
  const doc = await db.collection('boards').doc(id).get();
  if (doc.exists) {
    return doc.data() as Board;
  }
  return null;
}

// function to add a new board
async function addBoard(board: Board): Promise<Board> {
  // add a new board to the database
  const docRef = await db.collection('boards').add(board);
  // overwrite the id with the generated id
  board.id = docRef.id;
  // update the board with the new id
  await db.collection('boards').doc(board.id).set(board);
  return board;
}

// function to update a board
async function updateBoard(board: Board): Promise<Board | null> {
  const doc = await db.collection('boards').doc(board.id).get();
  if (doc.exists) {
    await db.collection('boards').doc(board.id).set(board);
    return board;
  }
  return null;
}

// function to delete a board
async function deleteBoard(id: string): Promise<boolean> {
  const doc = await db.collection('boards').doc(id).get();
  if (doc.exists) {
    deleteRelations(await getRelations('boards', id));
    await db.collection('boards').doc(id).delete();
    return true;
  }
  return false;
}

export {getBoards, getBoard, addBoard, updateBoard, deleteBoard};
