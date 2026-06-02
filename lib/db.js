'use strict';

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function openDb(dbPath) {
  ensureDir(path.dirname(dbPath));
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

function run(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params || [], function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get(db, sql, params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params || [], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function exec(db, sql) {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function initSchema(db) {
  await exec(db, 'PRAGMA foreign_keys = ON;');
  await exec(db, 'PRAGMA journal_mode = WAL;');
  await exec(db, 'PRAGMA synchronous = NORMAL;');
  await exec(db, `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_admin INTEGER NOT NULL DEFAULT 0,
      email TEXT,
      phone_e164 TEXT,
      whatsapp_e164 TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
}

async function upsertUserByUsername(db, user) {
  const now = new Date().toISOString();
  const existing = await get(db, 'SELECT id FROM users WHERE username = ?', [user.username]);
  if (!existing) {
    await run(
      db,
      `INSERT INTO users (username, password_hash, is_admin, email, phone_e164, whatsapp_e164, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.username,
        user.password_hash,
        user.is_admin ? 1 : 0,
        user.email || null,
        user.phone_e164 || null,
        user.whatsapp_e164 || null,
        now,
        now,
      ],
    );
    return;
  }

  await run(
    db,
    `UPDATE users
     SET password_hash = ?,
         is_admin = ?,
         email = ?,
         phone_e164 = ?,
         whatsapp_e164 = ?,
         updated_at = ?
     WHERE username = ?`,
    [
      user.password_hash,
      user.is_admin ? 1 : 0,
      user.email || null,
      user.phone_e164 || null,
      user.whatsapp_e164 || null,
      now,
      user.username,
    ],
  );
}

async function getUserByUsername(db, username) {
  return get(db, 'SELECT * FROM users WHERE username = ?', [username]);
}

module.exports = {
  openDb,
  initSchema,
  upsertUserByUsername,
  getUserByUsername,
  run,
  get,
};

