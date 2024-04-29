import type {Comment, CommentDocument} from './Comment';
import {db} from '../db';

type FindCommentsOptions = {
  parentId?: string;
  limit?: number;
  offset?: number;
};
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

type FindCommentOptions = {
  id: string;
};
export async function findComment({
  id,
}: FindCommentOptions): Promise<CommentDocument> {
  const doc = await db.collection('comments').doc(id).get();
  const data = doc.data() as CommentDocument;
  data.id = doc.id;
  return data;
}

type UpdateCommentOptions = {
  id: string;
  board: Comment | CommentDocument;
};
export async function updateComment({
  id,
  board,
}: UpdateCommentOptions): Promise<CommentDocument> {
  await db.collection('comments').doc(id).set(board);
  return findComment({id});
}

type CreateCommentOptions = {
  board: Comment;
};
export async function createComment({
  board,
}: CreateCommentOptions): Promise<CommentDocument> {
  const newComment = await db.collection('comments').add(board);
  const doc = await newComment.get();
  return doc.data() as CommentDocument;
}

export async function removeComment({id}: FindCommentOptions): Promise<void> {
  await db.collection('comments').doc(id).delete();
}
