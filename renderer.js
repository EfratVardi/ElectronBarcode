// // This file is required by the index.html file and will
// // be executed in the renderer process for that window.
// // All of the Node.js APIs are available in this process.
// var fs = require("fs");
// const electron = require('electron')
// const { JSDOM } = require( "jsdom" );
// const { window } = new JSDOM( "" );
// const $ = require( "jquery" )( window );
// // Importing BrowserWindow from Main
// const BrowserWindow = electron.remote.BrowserWindow;

// var writeStream = fs.createWriteStream("JournalDEV.txt");
// writeStream.write("Hi, JournalDEV Users. ");
// writeStream.write("Thank You.");
// writeStream.end();


// var current = document.getElementById('current');
// var options = {
// 	silent: true,
// 	printBackground: true,
// 	color: false,
// 	margin: {
// 		marginType: 'printableArea'
// 	},
// 	landscape: false,
// 	pagesPerSheet: 1,
// 	collate: false,
// 	copies: 1,
// 	header: 'Header of the Page',
// 	footer: 'Footer of the Page'
// }

// current.addEventListener('click', (event) => {
// 	let win = BrowserWindow.getFocusedWindow();
// 	// let win = BrowserWindow.getAllWindows()[0];

// 	win.webContents.print(options, (success, failureReason) => {
// 		if (!success) console.log(failureReason);
// 		console.log('Print Initiated');
// 	});
// });
