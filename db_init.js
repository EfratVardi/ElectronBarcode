const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./efrat.sqlite');

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
      numPosition TEXT,
      hasPrint TEXT,
      hasBuy TEXT,
      device TEXT,
      color TEXT,
      type TEXT,
      hasParents TEXT,
      hasTests TEXT,
      timer TEXT,
      buy TEXT,
      textColor TEXT
    )`);
    const defaultConfig = {
      numPosition: "",
      hasPrint: "1",
      hasBuy: "0",
      device: "0",
      color: "0",
      type: "0",
      hasParents: "0",
      hasTests: "0",
      timer: "10",
      buy: "false",
      textColor: "0"
    };
    db.run(`INSERT INTO systemConfig (${Object.keys(defaultConfig).join(",")}) VALUES (${Object.values(defaultConfig).map(() => '?').join(',')})`, Object.values(defaultConfig));
  });
}

module.exports = { ensureTablesAndDefaults };
