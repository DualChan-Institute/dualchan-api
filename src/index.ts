import type {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import {
  deleteBoard,
  getBoard,
  getBoards,
  postBoard,
  putBoard,
} from './board/boardHandler';
import {
  deleteComment,
  getComment,
  getComments,
  postComment,
  putComment,
} from './comment/commentHandler';

const server: FastifyInstance = Fastify({logger: true});

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
  // Cors
  await fastify.register(cors, {
    origin: '*',
  });

  // / Route
  fastify.get('/', def);

  // Boards
  fastify.get('/api/boards', getBoards);
  fastify.get('/api/board/:id', getBoard);
  fastify.post('/api/board', postBoard);
  fastify.put('/api/board/:id', putBoard);
  fastify.delete('/api/board/:id', deleteBoard);

  // Comments
  fastify.get('/api/comments', getComments);
  fastify.get('/api/comment/:id', getComment);
  fastify.post('/api/comment', postComment);
  fastify.put('/api/comment/:id', putComment);
  fastify.delete('/api/comment/:id', deleteComment);
};

server.register(routes);

(async () => {
  try {
    await server.listen({port: 3002});
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
