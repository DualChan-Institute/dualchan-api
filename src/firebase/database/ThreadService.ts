import type PaginationSettings from '../../types/PaginationSettings';
import type Thread from '../../types/Thread';
import {addRelation, getRelations} from './RelationService';
import {db} from './Service';

// function to get all threads (add pagination settings, because we cannot return all threads at once)
async function getThreads(
  boardId: string,
  paginationSettings: PaginationSettings,
): Promise<Thread[]> {
  const relations = await getRelations('boards', boardId);
  const threads: Thread[] = [];
  for (const relation of relations) {
    const doc = await db.collection('threads').doc(relation).get();
    if (doc.exists) {
      threads.push(doc.data() as Thread);
    }
  }
  return threads;
}

// function to get a specific thread
async function getThread(id: string): Promise<Thread | null> {
  // get thread based off his id
  const doc = await db.collection('threads').doc(id).get();
  if (doc.exists) {
    return doc.data() as Thread;
  }
  return null;
}

// function to add a new thread
async function addThread(
  boardId: string,
  thread: Thread,
): Promise<Thread | string> {
  // when board does not exist, return null
  const board = await db.collection('boards').doc(boardId).get();
  if (!board.exists) {
    return `Board with id ${boardId} does not exist.`;
  }

  // add a new thread to the database
  const docRef = await db.collection('threads').add(thread);
  // overwrite the id with the generated id
  thread.id = docRef.id;
  // add a relation from the board to the thread
  await addRelation('boards', boardId, 'threads', thread.id);
  return thread;
}

// function to update a thread
async function updateThread(thread: Thread): Promise<Thread | null> {
  // get the thread based off his id
  const doc = await db.collection('threads').doc(thread.id).get();
  if (doc.exists) {
    await db.collection('threads').doc(thread.id).set(thread);
    return thread;
  }
  return null;
}

// function to delete a thread
async function deleteThread(id: string): Promise<boolean> {
  // delete all relations to the thread
  const relations = await getRelations('threads', id);
  for (const relation of relations) {
    await db.collection('relations').doc(relation).delete();
  }
  // delete the thread
  const doc = await db.collection('threads').doc(id).get();
  if (doc.exists) {
    await db.collection('threads').doc(id).delete();
    return true;
  }
  return false;
}

export {getThreads, getThread, addThread, updateThread, deleteThread};
