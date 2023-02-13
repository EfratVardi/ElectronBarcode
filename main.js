const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')
let mainWindow

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 800, height: 600, fullscreen: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })
  mainWindow.loadFile('User.html')
  mainWindow.menuBarVisible = false

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

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})



