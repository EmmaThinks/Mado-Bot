import Database from "better-sqlite3";
import path from "path";

// Inicializa la DB en un archivo local
const dbPath = path.join(process.cwd(), "memory.sqlite");
const db = new Database(dbPath);

// Creamos la tabla si no existe
// user_id: ID del usuario de Discord
// role: "user" (usuario) o "model" (el bot)
// content: El texto del mensaje
// timestamp: Para ordenar
db.exec(`
  CREATE TABLE IF NOT EXISTS conversation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const MemoryManager = {
  // Guardar un mensaje
  saveMessage: (userId: string, role: "user" | "model", content: string) => {
    const stmt = db.prepare(
      "INSERT INTO conversation_history (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
    );
    stmt.run(userId, role, content, Date.now());
  },

  // Obtener historial (limitado a los últimos 10 mensajes para ahorrar tokens)
  getHistory: (userId: string): ChatMessage[] => {
    const stmt = db.prepare(
      "SELECT role, content FROM conversation_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10",
    );
    const rows = stmt.all(userId) as {
      role: "user" | "model";
      content: string;
    }[];

    // Gemini necesita el historial en orden cronológico (el query lo trajo al revés por el LIMIT)
    return rows.reverse().map((row) => ({
      role: row.role,
      parts: [{ text: row.content }],
    }));
  },

  // Opcional: Limpiar memoria
  clearMemory: (userId: string) => {
    const stmt = db.prepare(
      "DELETE FROM conversation_history WHERE user_id = ?",
    );
    stmt.run(userId);
  },
};
