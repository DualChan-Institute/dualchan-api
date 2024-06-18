/**
 * Definiert ein Zod-Schema für die Validierung von Abfrageparametern zur Paginierung.
 * Enthält optionale Eigenschaften 'limit' und 'offset', die beide Strings sein können.
 *
 * 'limit': Optional, gibt an, wie viele Elemente pro Seite zurückgegeben werden sollen.
 * 'offset': Optional, gibt an, ab welchem Index die Ergebnisse zurückgegeben werden sollen.
 */
import {z} from 'zod';

export const PaginationZ = z.object({
  limit: z.string().optional(), // Optionale Begrenzung der zurückgegebenen Elemente pro Seite
  offset: z.string().optional(), // Optionaler Offset, ab welchem Index die Ergebnisse zurückgegeben werden sollen
});

/**
 * Transformiert das PaginationZ-Schema, um numerische Werte für 'limit' und 'offset' zu erhalten.
 * Konvertiert die Strings von 'limit' und 'offset' in Integer-Werte.
 * Wenn 'limit' oder 'offset' nicht vorhanden sind, werden sie als 'undefined' zurückgegeben.
 */
export const PaginationNumberZ = PaginationZ.transform((data) => {
  return {
    limit: data.limit ? parseInt(data.limit) : undefined, // Konvertiert 'limit' in Integer, falls vorhanden
    offset: data.offset ? parseInt(data.offset) : undefined, // Konvertiert 'offset' in Integer, falls vorhanden
  };
});
