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
  console.log("hi");
  fs.readFile(args + '.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
      if (err)
        console.log(err);
      else {
        console.log("sucsses");
        mainWindow.webContents.send("receiveReadExcel"+args, data);
      }
    });
});

ipcMain.on("sendWriteExcel", (event, args) => {
  console.log('hi');
  fs.writeFile(args[0] + '.txt', args[1], err => {
    if (err) {
      console.error(err);
    }
    else {
      console.log("sucsses");
      mainWindow.webContents.send("receiveWriteExcel"+args[0], 1);
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



