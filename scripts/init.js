"use strict";
const { app, BrowserWindow } = require("electron");
const { ipcMain } = require("electron");
const fs = require("fs");

app.on("ready", () => {
	let index = new BrowserWindow({
		show: false,
		frame: false,
		width: 400,
		height: 300,
		minWidth: 800,
		minHeight: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	index.webContents.once("dom-ready", () => {
		index.webContents.send("init");
		index.webContents.openDevTools();
	});
	index.loadFile("./pages/index.html");
	index.show();

	
});

// app.on("ready", () => {
// 	let main = null;
// 	let loading = new BrowserWindow({
// 		show: false,
// 		frame: false,
// 		width: 400,
// 		height: 300,
// 		minWidth: 800,
// 		minHeight: 600,
// 		webPreferences: {
// 			nodeIntegration: true,
// 		},
// 	});

// 	loading.once("show", () => {
// 		main = new BrowserWindow({
// 			show: false,
// 			frame: false,
// 			width: 800,
// 			height: 600,
// 			webPreferences: {
// 				nodeIntegration: true,
// 			},
// 		});
// 		main.webContents.once("dom-ready", () => {
// 			//main.maximize();
// 			main.show();
// 			loading.hide();
// 			loading.close();
// 		});
// 		// long loading html
// 		main.loadFile("./pages/index.html");
// 		main.webContents.openDevTools();
// 	});
// 	loading.loadFile("./pages/loading.html");
// 	loading.show();
// });