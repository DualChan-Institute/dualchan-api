import type {FastifyReply, FastifyRequest} from 'fastify';
import {PaginationNumberZ} from '../generic/Pagination';
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
import {authenticate} from '../auth/AuthHandler';

/**
 * Definiert das Schema für Abfrageparameter, die beim Abrufen von Kommentaren verwendet werden.
 * @property search - Optionaler Suchbegriff.
 * @property parentId - Optionale Eltern-ID.
 * Kombiniert mit Paginierungsschema.
 */
const GetCommentsQueryZ = z
  .object({
    search: z.string().optional(),
    parentId: z.string(),
  })
  .and(PaginationNumberZ);

/**
 * Ruft Kommentare basierend auf den Abfrageparametern ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Abfrageparameter werden anhand des GetCommentsQueryZ-Schemas validiert.
 * Die Liste der gefundenen Kommentare wird zurückgegeben.
 */
export async function getComments(req: FastifyRequest, reply: FastifyReply) {
  const query = GetCommentsQueryZ.parse(req.query);
  const res = await findComments(query);
  reply.send(res);
}

/**
 * Ruft einen einzelnen Kommentar basierend auf der Kommentar-ID ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Kommentar-ID wird aus den URL-Parametern extrahiert und validiert.
 * Der gefundene Kommentar wird zurückgegeben.
 */
export async function getComment(req: FastifyRequest, reply: FastifyReply) {
  const {id} = IdZ.parse(req.params);
  const res = await findComment({id});
  reply.send(res);
}

/**
 * Aktualisiert die Informationen eines bestehenden Kommentars.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Kommentar-ID wird aus den URL-Parametern extrahiert und validiert.
 * Die neuen Kommentar-Daten werden anhand des CommentZ-Schemas validiert.
 * Der aktualisierte Kommentar wird zurückgegeben.
 */
export async function putComment(req: FastifyRequest, reply: FastifyReply) {
  if (!(await authenticate(req, reply))) return;

  const {id} = IdZ.parse(req.params);
  const comment = CommentZ.parse(req.body);
  const newComment = await updateComment({id, comment});
  reply.send(newComment);
}

/**
 * Erstellt einen neuen Kommentar.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die neuen Kommentar-Daten werden anhand des CommentZ-Schemas validiert.
 * Der neu erstellte Kommentar wird zurückgegeben.
 */
export async function postComment(req: FastifyRequest, reply: FastifyReply) {
  if (await authenticate(req, reply, true)) {
    // AUTHENTICATED
    const comment = CommentZ.parse(req.body);
    const newComment = await createComment({comment});
    reply.send(newComment);
  } else {
    // ANONYMOUS
    const comment = CommentZ.parse(req.body);
    comment.userId = '-1';
    const newComment = await createComment({comment});
    reply.send(newComment);
  }
}

/**
 * Löscht einen Kommentar.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Kommentar-ID wird aus den URL-Parametern extrahiert und validiert.
 * Der Kommentar wird gelöscht und die gelöschte Kommentar-ID wird zurückgegeben.
 */
export async function deleteComment(req: FastifyRequest, reply: FastifyReply) {
  if (!(await authenticate(req, reply))) return;

  const {id} = IdZ.parse(req.params);
  await removeComment({id});
  reply.send({id});
}
