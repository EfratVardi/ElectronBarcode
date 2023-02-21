const { contextBridge, ipcRenderer } = require('electron')
const electron = require('electron');
const fs = require('fs').promises;
const ipc = require('electron').ipcRenderer

var studentsExcel = '[]'; var uniqTasksExcel = '[]';
var tasksExcel = '[]'; var systemConfig = '{"title":"ברקוד","date":"2025-02-01","position":"","color":"1"}'
fs.readFile('studentsExcel.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
        if (err)
            console.log(err);
        else {
            studentsExcel = data
        }
    });

fs.readFile('uniqTasksExcel.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
        if (err)
            console.log(err);
        else {
            uniqTasksExcel = data
        }
    });

// fs.readFile('tasksExcel.txt',
//     { encoding: 'utf8', flag: 'r' },
//     function (err, data) {
//         if (err)
//             console.log(err);
//         else {
//             tasksExcel = data
//         }
//     });
fs.readFile('systemConfig.txt',
    { encoding: 'utf8', flag: 'r' },
    function (err, data) {
        if (err)
            console.log(err);
        else {
            systemConfig = data
        }
    });

contextBridge.exposeInMainWorld('expose', {
    send: (channel, data) => {
        let validChannels = ["toMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    },
    studentsExcel: () => studentsExcel,
    uniqTasksExcel: () => uniqTasksExcel,
    tasksExcel: () => tasksExcel,
    systemConfig: () => systemConfig,
    writeToFile: (filename, content) => {
        fs.writeFile(filename + '.txt', content, err => {
            if (err) {
                console.error(err);
            }
        });
    },
    appClose:()=>{
        ipc.send('close')
    }
});




