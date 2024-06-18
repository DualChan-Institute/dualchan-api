/**
 * Definiert ein Zod-Schema für die Validierung einer Objektstruktur mit einer 'id' Eigenschaft vom Typ String.
 * Das Schema wird verwendet, um Objekte zu validieren, die eine 'id' Eigenschaft enthalten müssen.
 */
import {z} from 'zod';

export const IdZ = z.object({
  id: z.string(), // Die 'id' muss ein String sein
});
