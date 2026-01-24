"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryManager = void 0;
var better_sqlite3_1 = require("better-sqlite3");
var path = require("path");
// Inicializa la DB en un archivo local
var dbPath = path.join(process.cwd(), "memory.sqlite");
var db = new better_sqlite3_1.default(dbPath);
// Creamos la tabla si no existe
// user_id: ID del usuario de Discord
// role: "user" (usuario) o "model" (el bot)
// content: El texto del mensaje
// timestamp: Para ordenar
db.exec("\n  CREATE TABLE IF NOT EXISTS conversation_history (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id TEXT NOT NULL,\n    role TEXT NOT NULL,\n    content TEXT NOT NULL,\n    timestamp INTEGER NOT NULL\n  )\n");
exports.MemoryManager = {
    // Guardar un mensaje
    saveMessage: function (userId, role, content) {
        var stmt = db.prepare("INSERT INTO conversation_history (user_id, role, content, timestamp) VALUES (?, ?, ?, ?)");
        stmt.run(userId, role, content, Date.now());
    },
    // Obtener historial (limitado a los últimos 10 mensajes para ahorrar tokens)
    getHistory: function (userId) {
        var stmt = db.prepare("SELECT role, content FROM conversation_history WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10");
        var rows = stmt.all(userId);
        // Gemini necesita el historial en orden cronológico (el query lo trajo al revés por el LIMIT)
        return rows.reverse().map(function (row) { return ({
            role: row.role,
            parts: [{ text: row.content }],
        }); });
    },
    // Opcional: Limpiar memoria
    clearMemory: function (userId) {
        var stmt = db.prepare("DELETE FROM conversation_history WHERE user_id = ?");
        stmt.run(userId);
    },
};
