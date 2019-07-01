import {app, BrowserWindow, ipcMain} from 'electron'
import * as fs from 'fs'
var pngToIco = require('png-to-ico')
const path = require('path')

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
