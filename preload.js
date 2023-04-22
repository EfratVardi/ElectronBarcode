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
    appClose: () => {
        ipc.send('close')
    }
});




