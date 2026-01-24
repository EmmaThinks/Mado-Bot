import Database from "better-sqlite3";
import * as path from "path";

const dbPath = path.join(process.cwd(), "memory.sqlite");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS conversation_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    timestamp INTEGER NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS user_profiles (
    user_id TEXT PRIMARY KEY,
    username TEXT,
    bio TEXT NOT NULL,
    last_updated INTEGER
  )
`);

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export const MemoryManager = {
  saveMessage: (userId: string, role: "user" | "model", content: string) => {
    const stmt = db.prepare(
      "INSERT INTO conversation_history (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)",
    );
    stmt.run(userId, role, content, Date.now());
  },

  getHistory: (userId: string): ChatMessage[] => {
    const stmt = db.prepare(
      "SELECT role, content FROM conversation_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 30",
    );
    const rows = stmt.all(userId) as {
      role: "user" | "model";
      content: string;
    }[];
    return rows.reverse().map((row) => ({
      role: row.role,
      parts: [{ text: row.content }],
    }));
  },

  getUserProfile: (userId: string): string => {
    const stmt = db.prepare("SELECT bio FROM user_profiles WHERE user_id = ?");
    const row = stmt.get(userId) as { bio: string } | undefined;
    return row ? row.bio : "";
  },

  updateUserProfile: (userId: string, username: string, newBio: string) => {
    const stmt = db.prepare(`
      INSERT INTO user_profiles (user_id, username, bio, last_updated)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      username = excluded.username,
      bio = excluded.bio,
      last_updated = excluded.last_updated
    `);
    stmt.run(userId, username, newBio, Date.now());
  },
};
