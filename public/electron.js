
const { app, BrowserWindow, utilityProcess } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const { spawn, exec } = require("child_process");
const log = require('electron-log');
const express = require('express');
//const serverPath = path.join(__dirname, 'node_modules/azaly-server/index.js');
const serverPath = path.join(process.resourcesPath, '/app.asar.unpacked/azaly-management-server.jar');


let mainWindow;
let childProcess;

let startOfflineServer = () => {
    if (!isDev) {
        //childProcess = exec(`java -jar "${serverPath}"`);

        childProcess = spawn(
            'java', ['-jar', serverPath,]
        );

        console.log("teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeest")
        console.log(serverPath)
        console.log(childProcess.pid)

        childProcess.on('error', (err) => {
            console.log(err);
            log.info("\n\t\tERROR: spawn failed! (" + err + ")");
        });

        childProcess.on('data', function (data) {
            log.info('stdout: ' + data);
        });

        childProcess.on('exit', (code, signal) => {
            log.info('exit code : ', code);
            log.info('exit signal : ', signal);

        });

        childProcess.unref();

        //on parent process exit, terminate child process too.
        process.on('exit', function () {
            childProcess.kill()
        })
    }
}

async function createWindow() {

    startOfflineServer();

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        icon: `file://${path.join(__dirname, '/icon.png')}`,
        webPreferences: {
            nodeIntegration: true
        }
    });
    const startURL = isDev ? 'http://localhost:3333' : `file://${path.join(__dirname, '../build/index.html')}`;
    // mainWindow.loadURL('http://localhost:3333');
    mainWindow.loadURL(startURL);
    // const expressApp = express();
    // expressApp.use(express.static(path.join(__dirname)));
    // const port = 3333;
    // expressApp.listen(port, () => {
    //     console.log(`Started listening on port ${port}.`);
    // })

    mainWindow.setMenu(null)
    // mainWindow.webContents.openDevTools();
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});