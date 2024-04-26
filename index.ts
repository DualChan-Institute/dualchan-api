import type {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import Fastify from 'fastify';
import {BoardParams, ThreadParams, CommentsParams} from './types/Params';

const server: FastifyInstance = Fastify({logger: true});

const mockPrivate = async (_req: FastifyRequest, _reply: FastifyReply) => ({
  hello: 'private',
});

const routes = async (fastify: FastifyInstance, _opts: any) => {
  // Boards
  fastify.get('/api/boards', mockPrivate);
  fastify.get('/api/boards/:id', mockPrivate);
  fastify.post('/api/boards', mockPrivate);
  fastify.put('/api/boards/:id', mockPrivate);
  fastify.delete('/api/boards/:id', mockPrivate);

  // Threads
  fastify.get('/api/board/:boardId/threads', mockPrivate);
  fastify.get('/api/board/:boardId/threads/:id', mockPrivate);
  fastify.post('/api/board/:boardId/threads', mockPrivate);
  fastify.put('/api/board/:boardId/threads/:id', mockPrivate);
  fastify.delete('/api/board/:boardId/threads/:id', mockPrivate);

  // Comments
  fastify.get('/api/board/:boardId/thread/:threadId/comments', mockPrivate);
  fastify.get('/api/board/:boardId/thread/:threadId/comments/:id', mockPrivate);
  fastify.post('/api/board/:boardId/thread/:threadId/comments', mockPrivate);
  fastify.put('/api/board/:boardId/thread/:threadId/comments/:id', mockPrivate);
  fastify.delete(
    '/api/board/:boardId/thread/:threadId/comments/:id',
    mockPrivate,
  );
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
