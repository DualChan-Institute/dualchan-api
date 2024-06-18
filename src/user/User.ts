import {z} from 'zod';
import {IdZ} from '../generic/Id';

/**
 * Definiert das Schema für Benutzer mit den folgenden Feldern:
 * - email: Eine gültige E-Mail-Adresse (string)
 * - password: Ein Passwort, das mindestens 6 Zeichen lang ist (string)
 */
export const UserZ = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * Definiert das Schema für Benutzerdokumente durch die Kombination des UserZ-Schemas
 * mit einem zusätzlichen ID-Feld aus dem IdZ-Schema.
 */
export const UserDocumentZ = UserZ.merge(IdZ);

/**
 * Definiert die Typen für die verschiedenen Schemas, die oben erstellt wurden:
 * - User: Typ für das UserZ-Schema
 * - UserDocument: Typ für das UserDocumentZ-Schema
 * - AuthPayload: Typ für das AuthPayloadZ-Schema
 * - AuthResponse: Typ für das AuthResponseZ-Schema
 */
export type User = z.infer<typeof UserZ>;
export type UserDocument = z.infer<typeof UserDocumentZ>;
