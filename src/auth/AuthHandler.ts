import type {FastifyReply, FastifyRequest} from 'fastify';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Lädt den JWT-Schlüssel aus den Umgebungsvariablen
const JWT_SECRET: string = process.env.JWT_SECRET as string;

export async function isAnonymUser(req: FastifyRequest, reply: FastifyReply) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return true;
  }
  return false;
}

/**
 * Funktion zur Authentifizierung eines Benutzers anhand eines JWT-Tokens.
 * Überprüft das Authorization-Header-Feld der Anfrage nach einem JWT-Token.
 * Falls kein Token vorhanden ist, wird ein Fehler mit Statuscode 401 zurückgegeben.
 * Extrahiert den Token aus dem Authorization-Header und verifiziert ihn mit dem JWT-Schlüssel.
 * Bei erfolgreicher Verifizierung wird das decodierte JWT-Payload zurückgegeben.
 * Bei fehlerhafter Verifizierung wird ein Fehler mit Statuscode 401 zurückgegeben.
 * @param req - Das FastifyRequest-Objekt, das die HTTP-Anfrage darstellt.
 * @param reply - Das FastifyReply-Objekt, das die HTTP-Antwort darstellt.
 * @returns Das decodierte JWT-Payload oder null bei fehlender oder ungültiger Authentifizierung.
 */
export async function authenticate(
  req: FastifyRequest,
  reply: FastifyReply,
  conditional = false,
) {
  // Extrahiert das Authorization-Header-Feld aus der Anfrage
  const authHeader = req.headers.authorization;

  // Überprüft, ob das Authorization-Header-Feld vorhanden ist
  if (!authHeader) {
    // Falls kein Authorization-Header-Feld vorhanden ist, wird ein Fehler mit Statuscode 401 zurückgegeben
    if (!conditional)
      reply.status(401).send({error: 'Authorization header missing'});
    return null;
  }

  // Extrahiert den JWT-Token aus dem Authorization-Header
  const token = authHeader.split(' ')[1];

  // Verifiziert den JWT-Token mit dem JWT-Schlüssel
  try {
    // Falls die Verifizierung erfolgreich ist, wird das decodierte JWT-Payload zurückgegeben
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Falls die Verifizierung fehlschlägt, wird ein Fehler mit Statuscode 401 zurückgegeben
    if (!conditional) reply.status(401).send({error: 'Invalid token'});
    return null;
  }
}
