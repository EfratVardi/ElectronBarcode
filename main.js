const { app, BrowserWindow, ipcMain, session, dialog } = require('electron')
const fs = require('fs')
let mainWindow
const path = require('path');
const db = require('./DB/dataBase');

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
  fs.readFile(args + '.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
      if (err) {
        mainWindow.webContents.send("receiveReadExcel" + args, 0);
      }
      else {
        mainWindow.webContents.send("receiveReadExcel" + args, data);
      }
    });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  if (args[1] && typeof args[1] === "string" && args[1].trim() !== "") {
    try {
      JSON.parse(args[1]);
      fs.writeFile(args[0] + '.txt', args[1], err => {
        if (err) {
          console.error(err);
        } else {
          mainWindow.webContents.send("receiveWriteExcel" + args[0], 1);
        }
      });
    } catch (e) {
      console.error("Invalid JSON data:", e);
      mainWindow.webContents.send("receiveWriteExcel" + args[0], 0);
    }
  } else {
    console.error("Empty or invalid data.");
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

ipcMain.on('getSystemSettings', (event) => {
  db.getSystemSettings((err, data) => {
    if (err) {
      event.reply('receiveSystemSettingsError', err);
    } else {
      event.reply('receiveSystemSettings', data);
    }
  });
});

ipcMain.on('updateSystemSettings', (event, updatedValues) => {
  db.updateSystemSettings
    (updatedValues, (err) => {
      if (err) {
        event.reply('receiveUpdateSystemSettings', { success: false, error: err.message });
      } else {
        event.reply('receiveUpdateSystemSettings', { success: true });
      }
    });
});

ipcMain.on('insertStudents', (event, fileData) => {
  let parsedData = JSON.parse(fileData);

  db.insertStudents(parsedData, (err) => {
    if (err) {
      event.reply("receiveInsertStudents", { success: false, error: err.message });
    } else {
      event.reply("receiveInsertStudents", { success: true });
    }
  });
});

ipcMain.on('insertTasks', (event, fileData) => {
  let parsedData = JSON.parse(fileData);

  db.insertTasks(parsedData, (err) => {
    if (err) {
      event.reply("receiveInsertTasks", { success: false, error: err.message });
    } else {
      event.reply("receiveInsertTasks", { success: true });
    }
  });
});

ipcMain.on('insertProducts', (event, fileData) => {
  let parsedData = JSON.parse(fileData);

  db.insertProducts(parsedData, (err) => {
    if (err) {
      event.reply("receiveInsertProducts", { success: false, error: err.message });
    } else {
      event.reply("receiveInsertProducts", { success: true });
    }
  });
});

ipcMain.on('updateStudent', (event, { tz, points }) => {
  db.updateStudent(tz, points, (err, result) => {
    if (err) {
      event.reply("updateStudentResponse", { success: false, error: err.message });
    } else {
      event.reply("updateStudentResponse", { success: true, updatedId: tz });
    }
  });
});


ipcMain.on('getStudentByTz', (event, tz) => {
  db.getStudentByTz(tz, (err, student) => {
    if (err) {
      event.reply("getStudentByTzResponse", { success: false, error: err.message });
    } else if (!student) {
      event.reply("getStudentByTzResponse", { success: false, error: "Student not found" });
    } else {
      event.reply("getStudentByTzResponse", { success: true, student });
    }
  });
});

ipcMain.on('getTaskByCode', (event, code) => {

  db.getTaskByCode(code, (err, task) => {
    if (err) {
      event.reply("getTaskByCodeResponse", { success: false, error: err.message });
    } else if (!task) {
      event.reply("getTaskByCodeResponse", { success: false, error: "Task not found" });
    } else {
      event.reply("getTaskByCodeResponse", { success: true, task });
    }
  });
});

ipcMain.on('getAllStudents', (event) => {
  db.getAllStudents((err, students) => {
    if (err) {
      event.reply("getAllStudentsResponse", { success: false, error: err.message });
    } else {
      event.reply("getAllStudentsResponse", { success: true, students });
    }
  });
});

ipcMain.on('getAllProducts', (event) => {
  db.getAllProducts((err, products) => {
    if (err) {
      event.reply("getAllProductsResponse", { success: false, error: err.message });
    } else {
      event.reply("getAllProductsResponse", { success: true, products });
    }
  });
});


ipcMain.on('updateBuyStatus', (event, buy) => {
  db.updateBuyStatus(buy, (err, result) => {
    if (err) {
      event.reply("updateBuyStatusResponse", { success: false, error: err.message });
    } else {
      event.reply("updateBuyStatusResponse", { success: true });
    }
  });
});

ipcMain.on('insertProduct', (event, { code, name, points, type, multiple }) => {
  db.insertProduct(code, name, points, type, multiple, (err, result) => {
    if (err) {
      event.reply("insertProductResponse", { success: false, error: err.message });
    } else {
      event.reply("insertProductResponse", { success: true, insertedId: result.insertedId });
    }
  });
});

ipcMain.on('updateProduct', (event, { code, name, points }) => {
  console.log("Updating product:", code, name, points);

  db.updateProduct(code, name, points, (err, result) => {
    if (err) {
      event.reply("updateProductResponse", { success: false, error: err.message });
    } else {
      event.reply("updateProductResponse", { success: true });
    }
  });
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



