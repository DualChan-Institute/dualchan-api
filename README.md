---

# DualChan Backend

Das DualChan Backend ist eine RESTful API, die in Node.js mit dem Fastify Framework implementiert wurde. Es stellt eine Schnittstelle für die Verwaltung von Boards, Kommentaren, Benutzern und Authentifizierungsfunktionen bereit.

## Installation

Zum Starten des Backends müssen Sie sicherstellen, dass Node.js und npm (Node Package Manager) auf Ihrem System installiert sind. Führen Sie dann die folgenden Schritte aus:

1. **Installation der Abhängigkeiten:**
   ```bash
   npm install
   ```

2. **Starten des Servers:**
   ```bash
   npm start
   ```

## Verzeichnisstruktur

Das Backend-Projekt ist in verschiedene Module unterteilt, die jeweils für spezifische Aufgaben zuständig sind:

- `board`: Handler und Services für das Management von Boards.
- `comment`: Handler und Services für das Management von Kommentaren.
- `user`: Handler und Services für das Management von Benutzern.
- `auth`: Authentifizierungs- und Registrierungsfunktionen.

## Verwendete Technologien

- **Fastify**: Ein schnelles und effizientes Webframework für Node.js.
- **Firebase Firestore**: Eine NoSQL-Datenbank zur Speicherung von Boards, Kommentaren und Benutzerinformationen.
- **Firebase Authentication**: Zur Authentifizierung und Autorisierung von Benutzern.
- **Zod**: Eine TypeScript-freundliche Schema-Validierungs- und Deklarationsbibliothek.

## API-Endpunkte

### Boards

- `GET /api/boards`: Abrufen aller Boards.
- `GET /api/board/:id`: Abrufen eines spezifischen Boards.
- `POST /api/board`: Erstellen eines neuen Boards.
- `PUT /api/board/:id`: Aktualisieren eines Boards.
- `DELETE /api/board/:id`: Löschen eines Boards.

### Kommentare

- `GET /api/comments`: Abrufen aller Kommentare.
- `GET /api/comment/:id`: Abrufen eines spezifischen Kommentars.
- `POST /api/comment`: Erstellen eines neuen Kommentars.
- `PUT /api/comment/:id`: Aktualisieren eines Kommentars.
- `DELETE /api/comment/:id`: Löschen eines Kommentars.

### Benutzer

- `GET /api/users`: Abrufen aller Benutzer.
- `GET /api/user/:id`: Abrufen eines spezifischen Benutzers.
- `POST /api/user`: Erstellen eines neuen Benutzers.
- `PUT /api/user/:id`: Aktualisieren eines Benutzers.
- `DELETE /api/user/:id`: Löschen eines Benutzers.

### Authentifizierung

- `POST /api/auth/register`: Registrieren eines neuen Benutzers.
- `POST /api/auth/login`: Anmelden eines Benutzers.

## Schemas und Validierung

Die API verwendet Schemas zur Validierung von Anfragen und zur Sicherstellung der Datenintegrität. Die Validierung erfolgt mithilfe der Zod-Bibliothek.

## Umgebungsvariablen

Das Projekt verwendet Umgebungsvariablen für die Konfiguration, insbesondere für die Verbindung mit Firebase und die JWT-Sicherheit.

---
