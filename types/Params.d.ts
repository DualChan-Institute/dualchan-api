/**
 * @fileoverview Types for params
 * @typedef {Object} BoardParams
 * @property {string} id
 * @typedef {Object} ThreadParams
 * @property {string} boardId
 * @property {string} id
 * @typedef {Object} CommentsParams
 * @property {string} boardId
 * @property {string} threadId
 * @property {string} id
 * @exports BoardParams
 * @exports ThreadParams
 * @exports CommentsParams
 * @example
 * import {BoardParams, ThreadParams, CommentsParams} from './types/Params';
 * const boardParams: BoardParams = {id: '1'};
 * console.log(boardParams);
 * // Output: { id: '1' }
 * const threadParams: ThreadParams = {boardId: '1', id: '1'};
 * console.log(threadParams);
 * // Output: { boardId: '1', id: '1' }
 * const commentsParams: CommentsParams = {boardId: '1', threadId: '1', id: '1'};
 * console.log(commentsParams);
 * // Output: { boardId: '1', threadId: '1', id: '1' }
 */
interface BoardParams {
  id: string;
}

interface ThreadParams {
  boardId: string;
  id: string;
}

interface CommentsParams {
  boardId: string;
  threadId: string;
  id: string;
}

export {BoardParams, ThreadParams, CommentsParams};
