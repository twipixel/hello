'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

/**
 * Unexpected token import 오류 시
 * .babelrc 파일이 있는지 체크
 * 없으면 생성하고 프리셋 2015로 설정합니다.
 * { "presets": ["es2015"] }
 */
app.on('ready', function () {
    const mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadURL('file://' + __dirname + '/lab/webgl/index.html');
    //mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function () {
        app.quit();
    });
});