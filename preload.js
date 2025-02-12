const { contextBridge, ipcRenderer } = require('electron')
const electron = require('electron');
const ipc = require('electron').ipcRenderer

contextBridge.exposeInMainWorld('expose', {
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },
    SendExcel: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    ReceiveExcel: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
    },

    // לשלוח בקשה לקבלת נתוני המערכת
    getSystemSettings: () => {
        ipcRenderer.send('get-system-settings'); // שליחת בקשה לקבלת ההגדרות
    },

    // קבלת הגדרות מערכת
    receiveSystemSettings: (func) => {
        ipcRenderer.on('system-settings', (event, data) => func(data));  // מחזירים את הנתונים
    },

    receiveSystemSettingsError: (func) => {
        ipcRenderer.on('system-settings-error', (event, error) => func(error)); // קבלת שגיאה
    },

    updateSystemSettings: (data) => {
        ipcRenderer.send('update-system-settings', data);
    },

    receiveUpdateSystemSettings: (callback) => {
        ipcRenderer.on('receive-update-system-settings', callback);
    },

    insertData: (fileName, fileData) => {
        ipcRenderer.send('insert-data', { fileName, fileData });
    },

    receiveInsertData: (callback) => {
        ipcRenderer.on('receive-insert-data', callback);
    },

    appClose: () => {
        ipc.send('close')
    }
});




