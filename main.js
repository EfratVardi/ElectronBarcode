const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800, height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadFile('User.html')
  mainWindow.menuBarVisible = true

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

ipcMain.on("toMain", (event, args) => {
  var options = {
    silent: true
  }
  mainWindow.webContents.print(options, (success, failureReason) => {
    mainWindow.webContents.send("fromMain", success);
  });
});

ipcMain.on("sendReadExcel", (event, args) => {
  console.log("efrat error1!!");
  fs.readFile(args + '.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
      if (err)
        console.log(err + "error!!");
      else {
        console.log("error2");
        mainWindow.webContents.send("receiveReadExcel", data);
      }
    });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  console.log(args);
  fs.writeFile('studentsExcel' + '.txt', content, err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("error2");
      mainWindow.webContents.send("receiveWriteExcel", 1);
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



