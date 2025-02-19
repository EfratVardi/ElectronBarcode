const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(process.env.APPDATA || path.join(process.env.HOME, 'AppData', 'Roaming'), 'accumulatingpoints', 'database.sqlite');

if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('שגיאה בפתיחת מסד הנתונים:', err.message);
    } else {
        console.log('חיבור למסד הנתונים בוצע בהצלחה:', dbPath);
        db.run("PRAGMA journal_mode = WAL;", (err) => {
            if (err) {
                console.error("Error enabling WAL mode:", err.message);
            } else {
                console.log("WAL mode enabled");
            }
        });

        // הפעלת סנכרון חזק (מונע שחיתות)
        db.run("PRAGMA synchronous = NORMAL;");
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

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tz TEXT NOT NULL,
            name TEXT,
            grade TEXT,
            points INTEGER DEFAULT 0,
            position INTEGER        )
    `, (err) => {
        if (err) {
            console.error('Error creating students table:', err.message);
        } else {
            console.log('Created students table');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            points INTEGER DEFAULT 0,
            type TEXT,
            class BOOLEAN DEFAULT false,
            multiple BOOLEAN DEFAULT false
        )
    `, (err) => {
        if (err) {
            console.error('Error creating tasks table:', err.message);
        } else {
            console.log('Created tasks table');
        }
    });

    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            code TEXT NOT NULL,
            name TEXT NOT NULL,
            points INTEGER DEFAULT 0,
            type TEXT,
            multiple BOOLEAN DEFAULT false
        )
    `, (err) => {
        if (err) {
            console.error('Error creating products table:', err.message);
        } else {
            console.log('Created products table');
        }
    });
}

function insertDefaultSystemValues() {
    db.get(`SELECT COUNT(*) as count FROM system`, (err, row) => {
        if (err) {
            console.error('שגיאה בבדיקת קיומם של נתונים בטבלת system:', err.message);
        } else if (row.count === 0) {
            db.run(`
                INSERT INTO system (date, numPosition, hasPrint, hasBuy, device, color, type, hasParents, hasTests, timer, buy, textColor)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [getYesterdayDate(), "", true, true, 1, 1, 1, false, false, 10, false, 0], (err) => {
                if (err) {
                    console.error('שגיאה בהוספת ערכי ברירת מחדל לטבלת system:', err.message);
                } else {
                    console.log('הוזנו ערכי ברירת מחדל לטבלת system.');
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
            console.error('שגיאה בטעינת ערכי הגדרות המערכת:', err.message);
            callback(err, null);
        } else {
            console.log('ערכי הגדרות מערכת נטענו בהצלחה:', row);
            callback(null, row);  // מחזירים את הערכים לממשק
        }
    });
}

// בקובץ db.js
function updateSystemSettings(updatedValues, callback) {
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
            console.error('Error updating system settings:', err.message);
            callback(err);
        } else {
            console.log('System settings updated successfully.');
            callback(null);  // Success callback
        }
    });
}

function insertStudents(data, callback) {
    db.serialize(() => {
        db.run("DELETE FROM students", (err) => {
            if (err) {
                console.error("Error deleting students data:", err.message);
                return callback(err);
            }

            const query = `
                INSERT INTO students (tz, name, grade, points, position)
                VALUES (?, ?, ?, ?, ?)
            `;

            const stmt = db.prepare(query);

            data.forEach(student => {
                stmt.run(student.tz, student.name, student.grade, student.points, student.position
                );
            });

            stmt.finalize((err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    });
}

function insertTasks(data, callback) {
    db.serialize(() => {
        db.run("DELETE FROM tasks", (err) => {
            if (err) {
                return callback(err);
            }

            const query = `
                INSERT INTO Tasks (code, name, points, type, class, multiple)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const stmt = db.prepare(query);

            data.forEach(task => {
                stmt.run(task.code, task.name, task.points, task.type, task.class, task.multiple);
            });

            stmt.finalize((err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    });
}

function insertProducts(data, callback) {
    db.serialize(() => {
        db.run("DELETE FROM products", (err) => {
            if (err) {
                return callback(err);
            }

            const query = `
                INSERT INTO products (code, name, points, type, multiple)
                VALUES (?, ?, ?, ?, ?)
            `;

            const stmt = db.prepare(query);

            data.forEach(pro => {
                stmt.run(pro.code, pro.name, pro.points, pro.type, pro.multiple);
            });

            stmt.finalize((err) => {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        });
    });
}

function updateStudent(tz, points, callback) {
    const query = `
        UPDATE students
        SET points = ?
        WHERE tz = ?
    `;

    db.run(query, [points, tz], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { success: true, updatedId: tz });
        }
    });
}

function getStudentByTz(tz, callback) {
    const cleanTz = tz.replace(/^0+/, '');

    const query = `
        SELECT * FROM students WHERE tz = ?
    `;

    db.get(query, [cleanTz], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

function getTaskByCode(code, callback) {
    const query = `
        SELECT * FROM tasks WHERE code = ?
    `;

    db.get(query, [code], (err, row) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, row);
        }
    });
}

function getAllStudents(callback) {
    const query = `SELECT * FROM students`;

    db.all(query, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

function getAllProducts(callback) {
    const query = `SELECT * FROM products`;
    db.all(query, [], (err, rows) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, rows);
        }
    });
}

function updateBuyStatus(buy, callback) {
    const query = `
        UPDATE system
        SET buy = ?
        WHERE id = 1
    `;

    db.run(query, [buy], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { success: true });
        }
    });
}

function insertProduct(code, name, points, type, multiple, callback) {
    const query = `
        INSERT INTO products (code, name, points, type, multiple)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [code, name, points, type, multiple], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { success: true, insertedId: this.lastID });
        }
    });
}

function updateProduct(code, name, points, type, multiple, callback) {
    const query = `
        UPDATE products
        SET 
            name = COALESCE(?, name), 
            points = COALESCE(?, points), 
            type = COALESCE(?, type), 
            multiple = COALESCE(?, multiple)
        WHERE code = ?
    `;

    db.run(query, [name, points, type, multiple, code], function (err) {
        if (err) {
            console.error("Error updating product:", err.message);
            callback(err);
        } else {
            console.log(`Product ${code} updated successfully.`);
            callback(null, { success: true });
        }
    });
}

module.exports = {
    getSystemSettings,
    insertDefaultSystemValues,
    initializeDatabase,
    updateSystemSettings,
    insertStudents,
    insertTasks,
    updateStudent,
    getStudentByTz,
    getTaskByCode,
    getAllStudents,
    insertProducts,
    getAllProducts,
    updateBuyStatus,
    insertProduct,
    updateProduct

};