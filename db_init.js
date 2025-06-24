const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./efrat.sqlite');
const { getYesterdayDate } = require('./js/utils');

function ensureTablesAndDefaults(db) {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      grade TEXT,
      points INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      price INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS uniqTasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT,
      points INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS parents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      student_id INTEGER
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS tests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      date TEXT
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS systemConfig (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      numPosition TEXT,
      hasPrint BOOLEAN DEFAULT 1,
      hasBuy BOOLEAN DEFAULT 0,
      device INTEGER DEFAULT 0,
      color INTEGER DEFAULT 0,
      type INTEGER DEFAULT 0,
      hasParents BOOLEAN DEFAULT 0,
      hasTests BOOLEAN DEFAULT 0,
      timer INTEGER DEFAULT 10,
      buy BOOLEAN DEFAULT 0,
      textColor INTEGER DEFAULT 0
    )`);
    db.run(`INSERT INTO systemConfig (date) VALUES (?)`, getYesterdayDate());
  });
}

module.exports = { ensureTablesAndDefaults };
