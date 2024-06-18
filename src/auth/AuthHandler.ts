import type {FastifyReply, FastifyRequest} from 'fastify';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

// Lädt den JWT-Schlüssel aus den Umgebungsvariablen
const JWT_SECRET: string = process.env.JWT_SECRET as string;

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
export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
  // Extrahiert das Authorization-Header-Feld aus der Anfrage
  const authHeader = req.headers.authorization;

  // Überprüft, ob das Authorization-Header-Feld vorhanden ist
  if (!authHeader) {
    reply.status(401).send({error: 'Missing token'});
    return null;
  }

  // Extrahiert den Token aus dem Authorization-Header (Format: Bearer <token>)
  const token = authHeader.split(' ')[1];

  try {
    // Verifiziert den Token mit dem JWT-Schlüssel und dekodiert das JWT-Payload
    const decoded = jwt.verify(token, JWT_SECRET);

    // Gibt das decodierte JWT-Payload zurück
    return decoded;
  } catch (err) {
    // Bei Fehler (z.B. ungültiger Token) wird ein Fehler mit Statuscode 401 zurückgegeben
    reply.status(401).send({error: 'Invalid token'});
    return null;
  }
}
