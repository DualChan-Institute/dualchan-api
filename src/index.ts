import type {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import type {BoardParams, ThreadParams, CommentsParams} from './types/Params';
import {
  addBoard,
  deleteBoard,
  getBoard,
  getBoards,
  updateBoard,
} from './firebase/database/BoardService';
import {defaultPaginationSettings} from './Utils';
import type Board from './types/Board';
import {
  addThread,
  deleteThread,
  getThread,
  getThreads,
  updateThread,
} from './firebase/database/ThreadService';
import type Thread from './types/Thread';
import {
  addComment,
  deleteComment,
  getComment,
  getComments,
  updateComment,
} from './firebase/database/CommentService';
import type Comment from './types/Comment';

const server: FastifyInstance = Fastify({logger: true});
// boards routes
const board = async (_req: FastifyRequest, _reply: FastifyReply) => {
  const {method} = _req;
  const {id} = _req.params as BoardParams;

  if (method === 'GET') {
    if (id) {
      // we want to see a specific board
      return getBoard(id);
    }
    // we want to see all boards
    return getBoards(defaultPaginationSettings);
  } else if (method === 'POST') {
    // we want to add a new board
    return addBoard(_req.body as Board);
  } else if (method === 'PUT') {
    // we want to update a board
    return updateBoard(_req.body as Board);
  } else if (method === 'DELETE') {
    // we want to delete a board
    return deleteBoard(id);
  }
};

// threads routes
const thread = async (_req: FastifyRequest, _reply: FastifyReply) => {
  const {method} = _req;
  const {boardId, id} = _req.params as ThreadParams;

  if (method === 'GET') {
    if (id) {
      // we want to see a specific thread
      return getThread(id);
    }
    // we want to see all threads
    return getThreads(boardId, defaultPaginationSettings);
  } else if (method === 'POST') {
    // we want to add a new thread
    return addThread(boardId, _req.body as Thread);
  } else if (method === 'PUT') {
    // we want to update a thread
    return updateThread(_req.body as Thread);
  } else if (method === 'DELETE') {
    // we want to delete a thread
    return deleteThread(id);
  }
};

// comments routes
const comment = async (_req: FastifyRequest, _reply: FastifyReply) => {
  const {method} = _req;
  const {boardId, threadId, id} = _req.params as CommentsParams;

  if (method === 'GET') {
    if (id) {
      // we want to see a specific comment
      return getComment(id);
    }
    // we want to see all comments
    return getComments(threadId, defaultPaginationSettings);
  } else if (method === 'POST') {
    // we want to add a new comment
    return addComment(threadId, _req.body as Comment);
  } else if (method === 'PUT') {
    // we want to update a comment
    return updateComment(_req.body as Comment);
  } else if (method === 'DELETE') {
    // we want to delete a comment
    return deleteComment(threadId, id);
  }
};

const def = async (_req: FastifyRequest, _reply: FastifyReply) => {
  // reply send current name, description and version of the project
  return {
    name: 'dualchan-api',
    description:
      'Die Backend API für DualChan. Basierend auf Node.JS und Fastify.',
    version: '1.0.0',
    licence: 'ICS',
  };
};

const routes = async (fastify: FastifyInstance, _opts: any) => {
  // cors
  await fastify.register(cors, {
    origin: '*',
  });

  // / route
  fastify.get('/', def);

  // Boards
  fastify.get('/api/boards', board);
  fastify.get('/api/board/:id', board);
  fastify.post('/api/board', board);
  fastify.put('/api/board/:id', board);
  fastify.delete('/api/board/:id', board);

  // Threads
  fastify.get('/api/board/:boardId/threads', thread);
  fastify.get('/api/board/:boardId/thread/:id', thread);
  fastify.post('/api/board/:boardId/thread', thread);
  fastify.put('/api/board/:boardId/thread/:id', thread);
  fastify.delete('/api/board/:boardId/thread/:id', thread);

  // Comments
  fastify.get('/api/board/:boardId/thread/:threadId/comments', comment);
  fastify.get('/api/board/:boardId/thread/:threadId/comment/:id', comment);
  fastify.post('/api/board/:boardId/thread/:threadId/comment', comment);
  fastify.put('/api/board/:boardId/thread/:threadId/comment/:id', comment);
  fastify.delete('/api/board/:boardId/thread/:threadId/comment/:id', comment);
};

server.register(routes);

(async () => {
  try {
    await server.listen({port: 3000});
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
