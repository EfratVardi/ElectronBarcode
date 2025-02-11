const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// קביעת נתיב מסד הנתונים
const dbPath = path.join(process.env.APPDATA || path.join(process.env.HOME, 'AppData', 'Roaming'), 'accumulatingpoints', 'database.sqlite');

// יצירת התיקייה אם אינה קיימת
if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

// פתיחת חיבור למסד הנתונים
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ שגיאה בפתיחת מסד הנתונים:', err.message);
    } else {
        console.log('✅ חיבור למסד הנתונים בוצע בהצלחה:', dbPath);
        initializeDatabase();
    }
});

// פונקציה לקבלת תאריך של אתמול
function getYesterdayDate() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0]; // פורמט YYYY-MM-DD
}

// פונקציה ליצירת הטבלה והוספת ערכי ברירת מחדל
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS system (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            numPosition TEXT,
            hasPrint BOOLEAN DEFAULT true,
            hasBuy BOOLEAN DEFAULT true,
            device INTEGER DEFAULT 0,
            color INTEGER DEFAULT 0,
            type INTEGER DEFAULT 0,
            hasParents BOOLEAN DEFAULT false,
            hasTests BOOLEAN DEFAULT false,
            timer INTEGER DEFAULT 10,
            buy BOOLEAN DEFAULT false,
            textColor INTEGER DEFAULT 0
        )
    `, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Create System Table');
            insertDefaultSystemValues();
        }
    });
}

function insertDefaultSystemValues() {
    db.get(`SELECT COUNT(*) as count FROM system`, (err, row) => {
        if (err) {
            console.error('❌ שגיאה בבדיקת קיומם של נתונים בטבלת system:', err.message);
        } else if (row.count === 0) {
            db.run(`
                INSERT INTO system (date, numPosition, hasPrint, hasBuy, device, color, type, hasParents, hasTests, timer, buy, textColor)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [getYesterdayDate(), "", true, true, 1, 1, 1, false, false, 10, false, 0], (err) => {
                if (err) {
                    console.error('❌ שגיאה בהוספת ערכי ברירת מחדל לטבלת system:', err.message);
                } else {
                    console.log('✅ הוזנו ערכי ברירת מחדל לטבלת system.');
                }
            });
        }
    });
}

// פונקציה לשליפת הגדרות המערכת
function getSystemSettings(callback) {
    const query = `SELECT * FROM system LIMIT 1`;
    db.get(query, (err, row) => {
        if (err) {
            console.error('❌ שגיאה בטעינת ערכי הגדרות המערכת:', err.message);
            callback(err, null);
        } else {
            console.log('✅ ערכי הגדרות מערכת נטענו בהצלחה:', row);
            callback(null, row);  // מחזירים את הערכים לממשק
        }
    });
}

// בקובץ db.js
function updateSystemConfig(updatedValues, callback) {
    const query = `
        UPDATE system
        SET
            date = ?,
            numPosition = ?,
            hasPrint = ?,
            hasBuy = ?,
            device = ?,
            color = ?,
            type = ?,
            hasParents = ?,
            hasTests = ?,
            timer = ?,
            buy = ?,
            textColor = ?
        WHERE id = 1
    `;
    
    db.run(query, Object.values(updatedValues), (err) => {
        if (err) {
            console.error('❌ Error updating system settings:', err.message);
            callback(err);
        } else {
            console.log('✅ System settings updated successfully.');
            callback(null);  // Success callback
        }
    });
}


module.exports = {
    db,
    getSystemSettings,
    insertDefaultSystemValues,
    initializeDatabase,
    updateSystemConfig
};