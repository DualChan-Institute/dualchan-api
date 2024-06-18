import {z} from 'zod';

/**
 * Definiert das Schema für Authentifizierungs-Payloads mit den folgenden Feldern:
 * - email: Eine gültige E-Mail-Adresse (string)
 * - password: Ein Passwort, das mindestens 6 Zeichen lang ist (string)
 */
export const AuthPayloadZ = z.object({
  email: z.string().email(), // Die E-Mail muss eine gültige E-Mail-Adresse sein
  password: z.string().min(6), // Das Passwort muss mindestens 6 Zeichen lang sein
});

/**
 * Definiert das Schema für Authentifizierungsantworten mit den folgenden Feldern:
 * - token: Ein Authentifizierungstoken (string)
 */
export const AuthResponseZ = z.object({
  token: z.string(), // Der Token ist ein String
});

export type AuthPayload = z.infer<typeof AuthPayloadZ>;
export type AuthResponse = z.infer<typeof AuthResponseZ>;
