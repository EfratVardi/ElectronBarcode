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
        ipcRenderer.send('getSystemSettings'); // שליחת בקשה לקבלת ההגדרות
    },

    // קבלת הגדרות מערכת
    receiveSystemSettings: (func) => {
        ipcRenderer.on('receiveSystemSettings', (event, data) => func(data));  // מחזירים את הנתונים
    },

    receiveSystemSettingsError: (func) => {
        ipcRenderer.on('receiveSystemSettingsError', (event, error) => func(error)); // קבלת שגיאה
    },

    updateSystemSettings: (data) => {
        ipcRenderer.send('updateSystemSettings', data);
    },

    receiveUpdateSystemSettings: (callback) => {
        ipcRenderer.on('receiveUpdateSystemSettings', callback);
    },

    insertStudents: (fileData) => {
        ipcRenderer.send('insertStudents', fileData);
    },

    receiveInsertStudents: (callback) => {
        ipcRenderer.on('receiveInsertStudents', callback);
    },

    insertTasks: (fileData) => {
        ipcRenderer.send('insertTasks', fileData);
    },

    receiveInsertTasks: (callback) => {
        ipcRenderer.on('receiveInsertTasks', callback);
    },

    updateStudent: (tz, points) => {
        ipcRenderer.send('updateStudent', { tz, points });
    },

    receiveUpdateStudentResponse: (callback) => {
        ipcRenderer.on('updateStudentResponse', (event, response) => callback(response));
    },

    appClose: () => {
        ipc.send('close')
    }
});




