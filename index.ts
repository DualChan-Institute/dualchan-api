// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import fastify from 'fastify';

// create a board
import type Board from './types/Board';

const server = fastify();

server.get('/ping', async (request, reply) => {
  return 'pong\n';
});

server.listen({port: 8080}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
