const { app, BrowserWindow, ipcMain, session, dialog } = require('electron')
const fs = require('fs')
let mainWindow
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { ensureTablesAndDefaults } = require('./db_init');
const db = new sqlite3.Database('./efrat.sqlite');

// יצירת טבלאות וערכי ברירת מחדל בכל הרצה
ensureTablesAndDefaults(db);

function createWindow() {
  let ses = session.defaultSession

  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadFile('pages/main/user.html')
  mainWindow.menuBarVisible = false
  mainWindow.fullScreen = true;

  if (!app.isPackaged) {
    mainWindow.menuBarVisible = true
  }

  ses.on('will-download', (e, downloadItem, webContents) => {
    let name = downloadItem.getFilename()
    const existingFilePath = app.getPath('desktop') + `\\ניקוד תלמידים` + `/${name}`

    if (fs.existsSync(existingFilePath)) {
      fs.unlink(existingFilePath, (err) => {
        if (err) {
          console.error('Error removing the file:', err);
        } else {
          downloadItem.setSavePath(existingFilePath)
        }
      });
    }
    else {
      downloadItem.setSavePath(existingFilePath)
    }

    downloadItem.once('done', (event, state) => {
      if (state === 'completed') {
        dialog.showMessageBox({
          type: 'info',
          title: 'הודעת מערכת',
          message: 'הקובץ נשמר בהצלחה בשולחן העבודה בתקיית ניקוד תלמידים! '
        })
      } else {
        dialog.showErrorBox('הודעת מערכת', 'הקובץ לא נשמר')
      }
    })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

ipcMain.on("sendPrint", (event, args) => {
  let printWindow = new BrowserWindow({ show: false });
  printWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(args));
  printWindow.webContents.once('did-finish-load', () => {
    printWindow.webContents.print(
      { silent: true, printBackground: true },
      (success, errorType) => {
        mainWindow.webContents.send("receivePrint", success);
      }
    );
  });
});

ipcMain.on("sendReadExcel", (event, args) => {
  db.all(`SELECT * FROM ${args}`, [], (err, rows) => {
    if (err) {
      mainWindow.webContents.send("receiveReadExcel" + args, 0);
    } else {
      mainWindow.webContents.send("receiveReadExcel" + args, JSON.stringify(rows));
    }
  });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  if (args[1] && typeof args[1] === "string" && args[1].trim() !== "") {
    try {
      const data = JSON.parse(args[1]);
      // מחיקת כל הנתונים הקיימים בטבלה
      db.run(`DELETE FROM ${args[0]}`,(err) => {
        if (err) {
          mainWindow.webContents.send("receiveWriteExcel" + args[0], 0);
        } else {
          // הוספת נתונים חדשים
          if(Array.isArray(data)) {
            const placeholders = Object.keys(data[0] || {}).map(() => '?').join(',');
            const columns = Object.keys(data[0] || {}).join(',');
            const stmt = db.prepare(`INSERT INTO ${args[0]} (${columns}) VALUES (${placeholders})`);
            data.forEach(row => {
              stmt.run(Object.values(row));
            });
            stmt.finalize(() => {
              mainWindow.webContents.send("receiveWriteExcel" + args[0], 1);
            });
          } else {
            mainWindow.webContents.send("receiveWriteExcel" + args[0], 0);
          }
        }
      });
    } catch (e) {
      mainWindow.webContents.send("receiveWriteExcel" + args[0], 0);
    }
  } else {
    mainWindow.webContents.send("receiveWriteExcel" + args[0], 0);
  }
});

ipcMain.on("sendUploadBackground", (event, args) => {
  const fileData = args;
  const buffer = Buffer.from(fileData, "base64");
  fs.writeFile("personalBackground.png", buffer, (err) => {
    if (err) {
      console.log(err)
    }
    mainWindow.webContents.send("recieveUploadBackground", 1);
  });
});

ipcMain.on("sendReadSystemConfig", (event) => {
  db.get(`SELECT * FROM systemConfig LIMIT 1`, [], (err, row) => {
    if (err || !row) {
      mainWindow.webContents.send("receiveReadSystemConfig", 0);
    } else {
      mainWindow.webContents.send("receiveReadSystemConfig", JSON.stringify(row));
    }
  });
});

ipcMain.on("sendWriteSystemConfig", (event, args) => {
  try {
    const data = JSON.parse(args);
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(f => `${f} = ?`).join(", ");
    db.run(`UPDATE systemConfig SET ${setClause}`, values, function (err) {
      if (err) {
        mainWindow.webContents.send("receiveWriteSystemConfig", 0);
      } else {
        mainWindow.webContents.send("receiveWriteSystemConfig", 1);
      }
    });
  } catch (e) {
    mainWindow.webContents.send("receiveWriteSystemConfig", 0);
  }
});

ipcMain.on("sendUpdateSystemConfigField", (event, args) => {
  const { key, value } = args;
  db.run(
    `UPDATE systemConfig SET ${key} = ?`,
    [String(value)],
    function (err) {
      if (err) {
        mainWindow.webContents.send("receiveUpdateSystemConfigField", 0);
      } else {
        mainWindow.webContents.send("receiveUpdateSystemConfigField", 1);
      }
    }
  );
});

ipcMain.on('close', () => {
  app.quit()
})

app.on('window-all-closed', () => {
  app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})