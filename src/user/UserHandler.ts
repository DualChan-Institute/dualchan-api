import type {FastifyReply, FastifyRequest} from 'fastify';
import {UserZ} from './User';
import {
  createUser,
  findUsers,
  findUser,
  updateUser,
  removeUser,
  isEmailRegistered,
} from './UserService';
import {z} from 'zod';
import {PaginationNumberZ} from '../generic/Pagination';

import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {authenticate} from '../auth/AuthHandler';
import {AuthPayloadZ} from '../auth/Auth';
import type {AuthPayload, AuthResponse} from '../auth/Auth';

/**
 * Registriert einen neuen Benutzer.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Der Benutzer wird anhand des UserZ-Schemas validiert.
 * Überprüft, ob die E-Mail-Adresse bereits registriert ist.
 * Wenn die E-Mail-Adresse registriert ist, wird ein Fehler zurückgegeben.
 * Andernfalls wird der neue Benutzer erstellt und zurückgegeben.
 */
export async function registerUser(req: FastifyRequest, reply: FastifyReply) {
  const user = UserZ.parse(req.body);
  if (await isEmailRegistered(user.email)) {
    reply.status(400).send({error: 'Email already registered'});
    return;
  }
  const newUser = await createUser({user});
  reply.send(newUser);
}

/**
 * Meldet einen Benutzer an.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Der Anmelde-Load wird anhand des AuthPayloadZ-Schemas validiert.
 * Die Authentifizierungsantwort wird zurückgegeben.
 */
export async function loginUser(req: FastifyRequest, reply: FastifyReply) {
  const payload = AuthPayloadZ.parse(req.body);
  const authResponse = await authenticateUser({payload});
  reply.send(authResponse);
}

dotenv.config();

const JWT_SECRET: string = process.env.JWT_SECRET as string;

/**
 * Definiert die Optionen für die Authentifizierung eines Benutzers.
 * @property payload - Die Anmeldeinformationen des Benutzers.
 */
type AuthenticateUserOptions = {
  payload: AuthPayload;
};

/**
 * Authentifiziert einen Benutzer anhand der bereitgestellten Anmeldeinformationen.
 * @param payload - Die Anmeldeinformationen des Benutzers.
 * @returns Das Objekt mit dem JWT-Token.
 * @throws Fehler, wenn die E-Mail-Adresse oder das Passwort ungültig ist oder wenn kein JWT-Schlüssel bereitgestellt wurde.
 */
export async function authenticateUser({
  payload,
}: AuthenticateUserOptions): Promise<AuthResponse> {
  const user = (await findUsers({email: payload.email, limit: 1}))[0];
  if (!user || !(await bcrypt.compare(payload.password, user.password))) {
    throw new Error('Invalid email or password');
  }

  if (!JWT_SECRET) {
    throw new Error('No JWT secret provided');
  }

  const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET, {
    expiresIn: '1h',
  });

  return {token};
}

/**
 * Definiert das Schema für die Abfrageparameter, die beim Abrufen von Benutzern verwendet werden.
 * @property search - Optionaler Suchbegriff.
 * @property email - Optionale E-Mail-Adresse.
 * Kombiniert mit dem PaginationNumberZ-Schema.
 */
const GetUsersQueryZ = z
  .object({
    search: z.string().optional(),
    email: z.string().optional(),
  })
  .and(PaginationNumberZ);

/**
 * Ruft eine Liste von Benutzern basierend auf den angegebenen Abfrageparametern ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Abfrageparameter werden anhand des GetUsersQueryZ-Schemas validiert.
 * Die Liste der gefundenen Benutzer wird zurückgegeben.
 */
export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const query = GetUsersQueryZ.parse(req.query);
  const res = await findUsers(query);
  reply.send(res);
}

/**
 * Ruft einen einzelnen Benutzer basierend auf der Benutzer-ID ab.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Benutzer-ID wird aus den URL-Parametern extrahiert und validiert.
 * Der gefundene Benutzer wird zurückgegeben.
 */
export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  const {id} = z.object({id: z.string()}).parse(req.params);
  const user = await findUser({id});
  reply.send(user);
}

/**
 * Aktualisiert die Informationen eines bestehenden Benutzers.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die Benutzer-ID wird aus den URL-Parametern extrahiert und validiert.
 * Die neuen Benutzerdaten werden anhand des UserZ-Schemas validiert.
 * Der aktualisierte Benutzer wird zurückgegeben.
 */
export async function putUser(req: FastifyRequest, reply: FastifyReply) {
  const {id} = z.object({id: z.string()}).parse(req.params);
  const user = UserZ.parse(req.body);
  const updatedUser = await updateUser({id, user});
  reply.send(updatedUser);
}

/**
 * Erstellt einen neuen Benutzer.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Die neuen Benutzerdaten werden anhand des UserZ-Schemas validiert.
 * Der neu erstellte Benutzer wird zurückgegeben.
 */
export async function postUser(req: FastifyRequest, reply: FastifyReply) {
  const user = UserZ.parse(req.body);
  const newUser = await createUser({user});
  reply.send(newUser);
}

/**
 * Löscht einen Benutzer.
 * @param req - FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param reply - FastifyReply-Objekt, das die Antwort darstellt.
 * Authentifiziert den Benutzer, bevor die Löschaktion ausgeführt wird.
 * Die Benutzer-ID wird aus den URL-Parametern extrahiert und validiert.
 * Der Benutzer wird gelöscht und die gelöschte Benutzer-ID wird zurückgegeben.
 */
export async function deleteUser(req: FastifyRequest, reply: FastifyReply) {
  if (!(await authenticate(req, reply))) return;

  const {id} = z.object({id: z.string()}).parse(req.params);
  await removeUser({id});
  reply.send({id});
}
