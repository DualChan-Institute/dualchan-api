import {z} from 'zod';
import {IdZ} from '../generic/Id';

/**
 * Definiert das Schema für ein Board mit den folgenden Feldern:
 * - name: Der Name des Boards (string)
 * - description: Die Beschreibung des Boards, die null sein kann (string | null)
 * - slug: Ein eindeutiger Slug für das Board (string)
 */
export const BoardZ = z.object({
  name: z.string(),
  description: z.string().nullable(),
  slug: z.string(),
});

/**
 * Definiert das Schema für ein Board-Dokument durch die Kombination des BoardZ-Schemas
 * mit einem zusätzlichen ID-Feld aus dem IdZ-Schema.
 */
export const BoardDocumentZ = BoardZ.merge(IdZ);

/**
 * Definiert den Typ für die Erstellung und Aktualisierung eines Boards basierend auf dem BoardZ-Schema.
 */
export type Board = z.infer<typeof BoardZ>;

/**
 * Definiert den Typ für das Abrufen eines Board-Dokuments basierend auf dem BoardDocumentZ-Schema.
 */
export type BoardDocument = z.infer<typeof BoardDocumentZ>;
