import type {FastifyReply, FastifyRequest} from 'fastify';
import {PaginationNumberZ} from '../generic/Pagination';
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
import {authenticate} from '../auth/AuthHandler';

/**
 * Definiert das Schema für Abfrageparameter, die beim Abrufen von Boards verwendet werden.
 * @property search - Optionaler Suchbegriff.
 * @property slug - Optionaler Slug.
 * Kombiniert mit Paginierungsschema.
 */
const GetBoardsQueryZ = z
  .object({
    search: z.string().optional(),
    slug: z.string().optional(),
  })
  .and(PaginationNumberZ);

/**
 * Ruft Boards basierend auf den Abfrageparametern ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Abfrageparameter werden anhand des GetBoardsQueryZ-Schemas validiert.
 * Die Liste der gefundenen Boards wird zurückgegeben.
 */
export async function getBoards(req: FastifyRequest, reply: FastifyReply) {
  const query = GetBoardsQueryZ.parse(req.query);
  const res = await findBoards(query);
  reply.send(res);
}

/**
 * Ruft ein einzelnes Board basierend auf der Board-ID ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Board-ID wird aus den URL-Parametern extrahiert und validiert.
 * Das gefundene Board wird zurückgegeben.
 */
export async function getBoard(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const res = await findBoard({id});
  reply.send(res);
}

/**
 * Aktualisiert die Informationen eines bestehenden Boards.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Board-ID wird aus den URL-Parametern extrahiert und validiert.
 * Die neuen Board-Daten werden anhand des BoardZ-Schemas validiert.
 * Das aktualisierte Board wird zurückgegeben.
 */
export async function putBoard(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const board = BoardZ.parse(req.body);
  const newBoard = await updateBoard({id, board});
  reply.send(newBoard);
}

/**
 * Erstellt ein neues Board.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die neuen Board-Daten werden anhand des BoardZ-Schemas validiert.
 * Das neu erstellte Board wird zurückgegeben.
 */
export async function postBoard(req: FastifyRequest, reply: FastifyReply) {
  const board = BoardZ.parse(req.body);
  const newBoard = await createBoard({board});
  reply.send(newBoard);
}

/**
 * Löscht ein Board.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Authentifiziert den Benutzer, bevor die Löschaktion ausgeführt wird.
 * Die Board-ID wird aus den URL-Parametern extrahiert und validiert.
 * Das Board wird gelöscht und die gelöschte Board-ID wird zurückgegeben.
 */
export async function deleteBoard(req: FastifyRequest, reply: FastifyReply) {
  if (!(await authenticate(req, reply))) return;

  const {id} = IdZ.parse(req.params);
  await removeBoard({id});
  reply.send({id});
}
