import initSqlJs, { type Database } from "sql.js";
import { randomUUID } from "node:crypto";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "plannerzeed.db");

let db: Database | null = null;
let dbPromise: Promise<Database> | null = null;

async function getDb(): Promise<Database> {
  if (db) return db;
  if (dbPromise) return dbPromise;
  
  const SQL = await initSqlJs();
  
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    db = new SQL.Database();
  }
  
  db.run("PRAGMA journal_mode = WAL");
  db.run("PRAGMA foreign_keys = ON");
  
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'work',
      priority TEXT NOT NULL DEFAULT 'medium',
      date TEXT,
      time TEXT,
      end_time TEXT,
      completed INTEGER NOT NULL DEFAULT 0,
      icon TEXT DEFAULT 'task',
      color TEXT DEFAULT 'primary',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      content TEXT,
      category TEXT NOT NULL DEFAULT 'Notes',
      color TEXT NOT NULL DEFAULT 'primary',
      is_favorite INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      push_notifications INTEGER NOT NULL DEFAULT 1,
      do_not_disturb INTEGER NOT NULL DEFAULT 0,
      theme TEXT NOT NULL DEFAULT 'dark',
      accent_color TEXT NOT NULL DEFAULT '#85adff',
      cloud_sync INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    CREATE INDEX IF NOT EXISTS idx_tasks_date ON tasks(date);
    CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
    CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
    CREATE INDEX IF NOT EXISTS idx_settings_user_id ON settings(user_id);
  `);
  
  saveDb();
  dbPromise = Promise.resolve(db);
  return db;
}

function saveDb() {
  if (db) {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function runQuery(sql: string, params?: any[]): any[] {
  if (!db) throw new Error("DB not initialized");
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  const results: any[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  saveDb();
  return results;
}

function runExec(sql: string, params?: any[]): void {
  if (!db) throw new Error("DB not initialized");
  const stmt = db.prepare(sql);
  if (params) stmt.bind(params);
  stmt.step();
  stmt.free();
  saveDb();
}

function getRow(sql: string, params?: any[]): any {
  const results = runQuery(sql, params);
  return results[0] || null;
}

function getAll(sql: string, params?: any[]): any[] {
  return runQuery(sql, params);
}

export { getDb, randomUUID, runExec, getRow, getAll, saveDb };
