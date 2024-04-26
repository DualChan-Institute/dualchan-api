import type PaginationSettings from '../../types/PaginationSettings';
import type Comment from '../../types/Comment';
import {db} from './Service';

// function to get all comments on a thread (add pagination settings, because we cannot return all comments at once)
async function getComments(
  threadId: string,
  paginationSettings: PaginationSettings,
): Promise<Comment[]> {
  // get command based of the relation from board to thread to comment
  const relations = await db.collection('relations').get();
  const comments: Comment[] = [];
  relations.forEach((doc) => {
    const data = doc.data();
    if (
      data.key_collection === 'threads' &&
      data.key_id === threadId &&
      data.value_collection === 'comments'
    ) {
      comments.push(data as Comment);
    }
  });
  return comments;
}

// function to get a specific comment
async function getComment(id: string): Promise<Comment | null> {
  // get comment based off his id
  const doc = await db.collection('comments').doc(id).get();
  if (doc.exists) {
    return doc.data() as Comment;
  }
  return null;
}

// function to add a new comment
async function addComment(
  threadId: string,
  comment: Comment,
): Promise<Comment | string> {
  // check if thread exists
  const thread = await db.collection('threads').doc(threadId).get();
  if (!thread.exists) {
    return `Thread with id ${threadId} does not exist.`;
  }

  // add a new comment to the database
  const docRef = await db.collection('comments').add(comment);
  // overwrite the id with the generated id
  comment.id = docRef.id;

  await db.collection('comments').doc(comment.id).set(comment);

  // add a relation from the thread to the comment
  await db.collection('relations').add({
    key_collection: 'threads',
    key_id: threadId,
    value_collection: 'comments',
    value_id: comment.id,
  });
  return comment;
}

// function to update a comment
async function updateComment(comment: Comment): Promise<Comment | null> {
  const doc = await db.collection('comments').doc(comment.id).get();
  if (doc.exists) {
    await db.collection('comments').doc(comment.id).set(comment);
    return comment;
  }
  return null;
}

// function to delete a comment
async function deleteComment(threadId: string, id: string): Promise<boolean> {
  // delete all relations to the comment
  const relations = await db.collection('relations').get();
  relations.forEach(async (doc) => {
    const data = doc.data();
    if (
      data.key_collection === 'threads' &&
      data.key_id === threadId &&
      data.value_collection === 'comments' &&
      data.value_id === id
    ) {
      await db.collection('relations').doc(doc.id).delete();
    }
  });

  // delete the comment
  const doc = await db.collection('comments').doc(id).get();
  if (doc.exists) {
    await db.collection('comments').doc(id).delete();
    return true;
  }
  return false;
}

export {getComments, getComment, addComment, updateComment, deleteComment};
