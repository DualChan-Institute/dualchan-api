import type {FastifyReply, FastifyRequest} from 'fastify';
import {PaginationZ} from '../generic/Pagination';
import {z} from 'zod';
import {
  createBoard,
  findBoard,
  findBoards,
  removeBoard,
  updateBoard,
} from './BoardService';
import {IdZ} from '../generic/Id';
import {BoardZ} from './Board';

const GetBoardsQueryZ = z
  .object({
    search: z.string().optional(),
    slug: z.string().optional(),
  })
  .merge(PaginationZ);

export async function getBoards(req: FastifyRequest, reply: FastifyReply) {
  const query = GetBoardsQueryZ.parse(req.query);
  const res = await findBoards(query);
  reply.send(res);
}

export async function getBoard(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const res = await findBoard({id});
  reply.send(res);
}

export async function putBoard(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const board = BoardZ.parse(req.body);
  const newBoard = await updateBoard({id, board});
  reply.send(newBoard);
}

export async function postBoard(req: FastifyRequest, reply: FastifyReply) {
  const board = BoardZ.parse(req.body);
  const newBoard = await createBoard({board});
  reply.send(newBoard);
}

export async function deleteBoard(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  await removeBoard({id});
  reply.send({id});
}
