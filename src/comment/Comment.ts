import {z} from 'zod';
import {IdZ} from '../generic/Id';

/**
 * Definiert das Schema für einen Kommentar mit den folgenden Feldern:
 * - parentId: Die ID des übergeordneten Elements (string).
 * - authorId: Die ID des Autors (string).
 * - title: Der Titel des Kommentars, optional (string | undefined).
 * - text: Der Text des Kommentars (string).
 * - votes: Die Anzahl der Stimmen, die ein Ganzzahlwert ist (number).
 */
export const CommentZ = z.object({
  parentId: z.string(),
  authorId: z.string(),
  title: z.string().optional(),
  text: z.string(),
});

/**
 * Definiert das Schema für ein Kommentardokument durch die Kombination des CommentZ-Schemas
 * mit einem zusätzlichen ID-Feld aus dem IdZ-Schema.
 */
export const CommentDocumentZ = CommentZ.merge(IdZ);

/**
 * Definiert den Typ für die Erstellung und Aktualisierung eines Kommentars basierend auf dem CommentZ-Schema.
 */
export type Comment = z.infer<typeof CommentZ>;

/**
 * Definiert den Typ für das Abrufen eines Kommentardokuments basierend auf dem CommentDocumentZ-Schema.
 */
export type CommentDocument = z.infer<typeof CommentDocumentZ>;
