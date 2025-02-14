import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

let db;

async function initDatabase() {
    try {
        if (Capacitor.isNativePlatform()) {
            const sqlite = new SQLiteConnection(CapacitorSQLite);
            db = await sqlite.createConnection('mydb', false, 'no-encryption', 1);
            await db.open();
            alert("📀 Database initialized!");
        } else {
            console.warn("SQLite only works on native platforms (Android/iOS)");
        }
    } catch (error) {
        console.error("❌ Database init error:", error);
    }
}

// פונקציה ליצירת טבלה
async function createTable() {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                points INTEGER
            );
        `;
        await db.execute({ statements: query });
        console.log("✅ Table created successfully!");
    } catch (error) {
        console.error("❌ Error creating table:", error);
    }
}

// פונקציה להוספת משתמש
async function addUser(name, points) {
    try {
        const query = `INSERT INTO users (name, points) VALUES (?, ?);`;
        await db.run({ statement: query, values: [name, points] });
        alert(`✅ User '${name}' added with ${points} points!`);
    } catch (error) {
        console.error("❌ Error inserting user:", error);
    }
}

// פונקציה לקריאת כל המשתמשים מהטבלה
async function getUsers() {
    try {
        const query = `SELECT * FROM users;`;
        const result = await db.query({ statement: query });
        alert("📊 Users:", result.values);
        return result.values;
    } catch (error) {
        console.error("❌ Error getting users:", error);
        return [];
    }
}

export { initDatabase, createTable, addUser, getUsers };
