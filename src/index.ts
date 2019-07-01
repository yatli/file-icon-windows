import * as fs from 'fs'
import * as path from 'path'
import {db} from 'file-icons-js'
//import { K, U } from 'win32-api'

//const knl32 = K.load()
//const user32 = U.load()

import {app, BrowserWindow, ipcMain} from 'electron'
var pngToIco = require('png-to-ico')

async function createWindow() {
    let mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "renderer.js")
        },
    })

    mainWindow.loadFile("index.html")

    mainWindow.webContents.openDevTools()

}

function extractIcons() {
    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.on('ready', createWindow)

    // Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On macOS it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') app.quit()
    })

    ipcMain.on("SAVE_ICON", (ev: any, fileName:string, buffer: ArrayBuffer) => {
        fs.writeFile(fileName, buffer, err => {
            pngToIco(fileName).then((buf: any) => {
                fs.writeFileSync(fileName + ".ico", buf)
            })
        })
    })

}

function associate() {
}

function listExtensions() {
    console.log("------------------- FILE ICONS -----------------")
    for(let icon of db.fileIcons.byName) {

        var regex = icon.match.source
        regex = regex.substring(1, regex.length-1)

        let patterns = regex.split("|")

        console.log({
            name: icon.icon,
            match: patterns
        })
    }
}

extractIcons()
//listExtensions()
