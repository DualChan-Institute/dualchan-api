import type {FastifyReply, FastifyRequest} from 'fastify';
import {PaginationZ} from '../generic/Pagination';
import {z} from 'zod';
import {
  createComment,
  findComment,
  findComments,
  removeComment,
  updateComment,
} from './CommentService';
import {IdZ} from '../generic/Id';
import {CommentZ} from './Comment';
const GetCommentsQueryZ = z
  .object({
    search: z.string().optional(),
    parentId: z.string().optional(),
  })
  .merge(PaginationZ);

export async function getComments(req: FastifyRequest, reply: FastifyReply) {
  const query = GetCommentsQueryZ.parse(req.query);
  const res = await findComments(query);
  reply.send(res);
}

export async function getComment(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const res = await findComment({id});
  reply.send(res);
}

export async function putComment(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const board = CommentZ.parse(req.body);
  const newComment = await updateComment({id, board});
  reply.send(newComment);
}

export async function postComment(req: FastifyRequest, reply: FastifyReply) {
  const board = CommentZ.parse(req.body);
  const newComment = await createComment({board});
  reply.send(newComment);
}

export async function deleteComment(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  await removeComment({id});
  reply.send({id});
}
