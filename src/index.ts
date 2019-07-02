import * as fs from 'fs'
import * as path from 'path'
import {db} from 'file-icons-js'
import Jimp from 'jimp'
var ch = require('convex-hull')
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

const white = Jimp.rgbaToInt(255,255,255,255, () => {})
function line(img: Jimp, p1: number[], p2: number[]) {
    //console.log(`line: ${p1}-${p2}`)
    let steps = img.bitmap.height
    let x = p1[0]
    let y = p1[1]
    let dx = (p2[0] - x) / steps
    let dy = (p2[1] - y) / steps
    for(let s = 0; s < steps; ++s)
    {
        img.setPixelColor(white, x, y)
        x += dx
        y += dy
    }
}

class Queue<T> {
  _store: T[] = [];
  push(val: T) {
    this._store.push(val);
  }
  pop(): T | undefined {
    return this._store.shift();
  }
}

function floodfill(img: Jimp, queue: Queue<number[]>) {
    while(true){
        let p = queue.pop()
        if(!p)break
        let x = p[0]
        let y = p[1]
        if(img.getPixelColor(x,y) !== 0) continue
        img.setPixelColor(white, x, y)
        queue.push([ x-1, y])
        queue.push([ x, y-1])
        queue.push([ x+1, y])
        queue.push([ x, y+1])

    }
}

const convexIcons = [
    ".asciidoc.png",
    ".asm.png",
    ".awk.png",
    ".bat.png",
    ".bin.png",
    ".cl.png",
    ".clj.png",
    ".cmake.png",
    ".cmd.png",
    ".config.png",
    ".dat.png",
    ".el.png",
    ".fs.png",
    ".fsx.png",
    ".fsproj.png",
    ".g.png",
    ".g4.png",
    ".gawk.png",
    ".git.png",
    ".gitattributes.png",
    ".gitconfig.png",
    ".github.png",
    ".gitignore.png",
    ".gitmodules.png",
    ".gml.png",
    ".htm.png",
    ".html.png",
    ".js.png",
    ".json.png",
    ".jsx.png",
    ".l.png",
    ".less.png",
    ".lisp.png",
    ".lua.png",
    ".mawk.png",
    ".md.png",
    ".ml.png",
    ".nawk.png",
    ".nuspec.png",
    ".o.png",
    ".props.png",
    ".ps.png",
    ".ps1.png",
    ".ps1xml.png",
    ".psd1.png",
    ".psm1.png",
    ".rb.png",
    ".rc.png",
    ".re.png",
    ".reg.png",
    ".rkt.png",
    ".rs.png",
    ".rst.png",
    ".s.png",
    ".scala.png",
    ".sexp.png",
    ".sh.png",
    ".sln.png",
    ".sparql.png",
    ".sql.png",
    ".targets.png",
    ".ts.png",
    ".txt.png",
    ".xaml.png",
    ".xml.png",
    ".xsd.png",
    ".y.png",
    ".yml.png",
    "CMakeLists.txt.png",
    "Doxyfile.png",
]

async function processRectIcon(fileName: string) {
    let _jimp = await Jimp.read(fileName)
    let bitmap = _jimp.bitmap
    let bglayer = await Jimp.read("src/bglayer.png")
    console.log("bglayer loaded") 

    _jimp.brightness(-0.7)
    console.log("blend to icon.")
    _jimp.composite(bglayer, 0, 0, {mode:Jimp.BLEND_DESTINATION_OVER, opacityDest:1, opacitySource:1})
    console.log("save it back")
    await _jimp.writeAsync(fileName)
}

async function processConvexIcon(fileName: string) {
    let _jimp = await Jimp.read(fileName)
    _jimp.brightness(-0.3)

    let bitmap = _jimp.bitmap
    let points: number[][] = []
    for(let y = 0; y < bitmap.height; ++y)
    {
        for(let x = 0; x < bitmap.width; ++x)
        {
            let color = _jimp.getPixelColor(x, y)
            if (color !== 0) {
                points.push([x,y])
            }
        }
    }

    let halfw = bitmap.width / 2
    let halfh = bitmap.height / 2

    console.log(`image: ${points.length} points`)
    if(points.length === 0) return
    let hull = ch(points).map((p: number[]) => {
        let x = points[p[0]][0]
        let y = points[p[0]][1]
        return [ halfw + (x - halfw) * 1.1, halfh + (y - halfh) * 1.1 ]
    })
    console.log(`convex hull: ${hull.length} points`)

    let bglayer = await new Promise<Jimp>((resolve, __) => {
        new Jimp(bitmap.width, bitmap.height, (err, img) => {
            //console.log("WTF")
            resolve(img)
        })
    })

    console.log("bglayer created") 

    // draw the bounds to bglayer
    hull.push(hull[0])
    for(let i = 0; i < hull.length - 1; ++i)
    {
        line(bglayer, hull[i], hull[i+1])
    }
    console.log("floodfill from center.")
    let q = new Queue<number[]>()
    q.push([halfw, halfh])
    floodfill(bglayer, q)
    console.log("blend to icon.")
    _jimp.composite(bglayer, 0, 0, {mode:Jimp.BLEND_DESTINATION_OVER, opacityDest:1, opacitySource:1})
    console.log("save it back")
    await _jimp.writeAsync(fileName)
}

async function processIcon(fileName: string) {

    if(convexIcons.indexOf(fileName) >= 0) {
        await processConvexIcon(fileName)
    }else{
        await processRectIcon(fileName)
    }

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

    ipcMain.on("SAVE_ICON", async (__: any, fileName:string, buffer: ArrayBuffer) => {
        console.log(`SAVE_ICON: ${fileName}`)
        await fs.promises.writeFile(fileName, buffer)
        await processIcon(fileName)
        let icoBuf = await pngToIco(fileName)
        await fs.promises.writeFile(fileName + ".ico", icoBuf)
        try{ await fs.promises.unlink(fileName) }catch{}
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
