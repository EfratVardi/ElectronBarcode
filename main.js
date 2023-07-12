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
  mainWindow.loadFile('LotteryUser.html')
   //mainWindow.loadFile('User.html')

  //mainWindow.setKiosk(true);
  mainWindow.menuBarVisible = false
  mainWindow.fullScreen = true;

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

ipcMain.on("sendPrint", (event, args) => {
  var options = {
    silent: true
  }
  mainWindow.webContents.print(options, (success, failureReason) => {
    mainWindow.webContents.send("receivePrint", success);
  });
});

ipcMain.on("sendReadExcel", (event, args) => {
  fs.readFile(args + '.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
      if (err)
        console.log(err)
      else {
        mainWindow.webContents.send("receiveReadExcel" + args, data);
      }
    });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  fs.writeFile(args[0] + '.txt', args[1], err => {
    if (err) {
      console.error(err);
    }
    else {
      mainWindow.webContents.send("receiveWriteExcel" + args[0], 1);
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



