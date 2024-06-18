/**
 * Autor: Tim Westphal
 *
 * Dies ist das Backend für DualChan, eine API basierend auf Node.js und Fastify.
 *
 * Das Backend bietet folgende Hauptfunktionen:
 * - Verwaltung von Boards: Erstellen, Lesen, Aktualisieren und Löschen von Boards.
 * - Verwaltung von Kommentaren: Erstellen, Lesen, Aktualisieren und Löschen von Kommentaren.
 * - Benutzerverwaltung: Registrierung, Authentifizierung, Abruf, Aktualisierung und Löschung von Benutzern.
 * - Authentifizierung: Benutzerregistrierung und Anmeldung mit JWT-Token.
 *
 * Die API verwendet CORS für Cross-Origin-Anfragen und ist auf Port 3002 konfiguriert.
 *
 * Das Server-Objekt `server` wird initialisiert und konfiguriert, um die Routen und Middleware zu verwalten.
 * Ein benutzerdefinierter Logger `logger` wird erstellt, der Nachrichten in einer Warteschlange speichert und ein Ereignis
 * `message` emittiert, wenn eine neue Nachricht geloggt wird. Der Server lauscht auf dieses Ereignis und loggt die Nachrichten.
 *
 * Die Funktion `routes` registriert die verschiedenen Routen für Boards, Kommentare, Benutzer und Authentifizierung.
 * Jede Route ist einem entsprechenden Handler zugeordnet, der die Anfragen verarbeitet.
 *
 */

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
import {
  getUsers,
  getUser,
  deleteUser,
  postUser,
  putUser,
  loginUser,
  registerUser,
} from './user/UserHandler';

/**
 * Initialisiert das Fastify-Server-Objekt für die DualChan-API.
 * Verwendet Fastify für das Erstellen eines HTTP-Servers mit Logging-Funktionen.
 */
const server: FastifyInstance = Fastify({logger: true});

/**
 * Handler-Funktion für die Wurzelroute '/'.
 * Gibt Metadaten über die API zurück, einschließlich Name, Beschreibung, Version und Lizenz.
 * @param _req - Das FastifyRequest-Objekt, das die Anfrage darstellt.
 * @param _reply - Das FastifyReply-Objekt, das die Antwort darstellt.
 * @returns Ein Objekt mit API-Metadaten.
 */
const def = async (_req: FastifyRequest, _reply: FastifyReply) => {
  return {
    name: 'dualchan-api',
    description:
      'Die Backend API für DualChan. Basierend auf Node.JS und Fastify.',
    version: '1.0.0',
    licence: 'ICS',
  };
};

/**
 * Funktion zur Definition der API-Routen.
 * Registriert verschiedene HTTP-Endpunkte für Boards, Kommentare, Benutzer und Authentifizierung.
 * Aktiviert CORS (Cross-Origin Resource Sharing) für alle Routen.
 * @param fastify - Das FastifyInstance-Objekt, das für das Routen-Handling verwendet wird.
 * @param _opts - Optionale Parameter für die Routen-Initialisierung (nicht verwendet in diesem Fall).
 */
const routes = async (fastify: FastifyInstance, _opts: any) => {
  // CORS aktivieren
  await fastify.register(cors, {
    origin: '*',
  });

  // Wurzelroute
  fastify.get('/', def);

  // Boards
  fastify.get('/api/boards', getBoards);
  fastify.get('/api/board/:id', getBoard);
  fastify.post('/api/board', postBoard);
  fastify.put('/api/board/:id', putBoard);
  fastify.delete('/api/board/:id', deleteBoard);

  // Kommentare
  fastify.get('/api/comments', getComments);
  fastify.get('/api/comment/:id', getComment);
  fastify.post('/api/comment', postComment);
  fastify.put('/api/comment/:id', putComment);
  fastify.delete('/api/comment/:id', deleteComment);

  // Benutzer
  fastify.get('/api/users', getUsers);
  fastify.get('/api/user/:id', getUser);
  fastify.post('/api/user', postUser);
  fastify.put('/api/user/:id', putUser);
  fastify.delete('/api/user/:id', deleteUser);

  // Authentifizierung
  fastify.post('/api/auth/register', registerUser);
  fastify.post('/api/auth/login', loginUser);
};

// Routen bei Fastify registrieren
server.register(routes);

// Funktion zum Starten des Servers
(async () => {
  try {
    await server.listen({port: 3002}); // Server auf Port 3002 starten
  } catch (err) {
    server.log.error(err); // Fehler behandeln und loggen
    process.exit(1); // Prozess bei einem Fehler beenden
  }
})();
