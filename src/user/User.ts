import {z} from 'zod';
import {IdZ} from '../generic/Id';

/**
 * Das Zod-Schema für die Validierung von Benutzerdaten.
 * Enthält folgende Felder:
 * - username: Der Benutzername (string).
 * - email: Eine gültige E-Mail-Adresse (string).
 * - password: Ein Passwort, das mindestens 6 Zeichen lang ist (string).
 */
export const UserZ = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * Das Zod-Schema für die öffentlichen Benutzerdaten.
 * Enthält alle Felder des UserZ-Schemas außer 'password' und 'email'.
 */
export const PublicUserZ = UserZ.omit({password: true, email: true}).merge(IdZ);

/**
 * Der Typ für öffentliche Benutzerdaten.
 * Inferiert aus dem PublicUserZ-Schema.
 */
export type PublicUser = z.infer<typeof PublicUserZ>;

/**
 * Das Zod-Schema für ein Benutzerdokument.
 * Kombiniert das UserZ-Schema mit einem ID-Feld aus dem IdZ-Schema.
 * Das 'password'-Feld wird im Benutzerdokument ausgeschlossen.
 */
export const UserDocumentZ = UserZ.merge(IdZ);

/**
 * Der Typ für Benutzerdaten, der aus dem UserZ-Schema inferiert wird.
 */
export type User = z.infer<typeof UserZ>;

/**
 * Der Typ für ein Benutzerdokument, der aus dem UserDocumentZ-Schema inferiert wird.
 */
export type UserDocument = z.infer<typeof UserDocumentZ>;
