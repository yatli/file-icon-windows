import {getClassWithColor, getClass} from 'file-icons-js'
import * as fs from 'fs'
import {Buffer} from 'buffer'
import { saveAs } from 'file-saver';
import domtoimage from 'dom-to-image'
import {ipcRenderer} from 'electron'

function _sleep(ms: number) {
    return new Promise((resolve, __) => setTimeout(resolve, ms));
}

function saveBlob(blob: Blob, fileName: string) {
    let reader = new FileReader()
    reader.onload = function() {
        if (reader.readyState == 2 && reader.result instanceof ArrayBuffer) {
            var buffer = new Buffer(reader.result)
            ipcRenderer.send("SAVE_ICON", fileName, buffer)
            console.log(`Saving ${JSON.stringify({ fileName, size: blob.size })}`)
        }
    }
    reader.readAsArrayBuffer(blob)
}

async function main() {


    let suffixes = [
        ".c", ".c", ".cpp", ".h", ".hpp", ".cc", ".hh", ".in", ".cmake", "CMakeLists.txt", "Makefile", ".mk",
        ".cs", ".fs", ".vb", ".rc", ".csproj", ".fsproj", ".vcxproj", ".sln", ".props", ".targets",
        ".settings", ".config", ".reg", ".yml", 
        ".scm", ".rkt", ".cl", ".el", ".lisp",
        ".ml", ".hs",
        ".ll", ".asm", ".o", ".s",
        ".java", ".scala", ".php",
        ".ino",
        ".rs",
        ".ps1", ".psd1", ".psm1", 
        ".bat", ".cmd", ".sh", 
        ".py", ".pl", ".rb", ".vim", 
        ".svg", ".png", ".jpg", ".bmp",
        ".xml", ".xaml", ".xsd",
        ".md", ".tex", ".rst",
        ".css", ".html", ".ts", ".js", ".js.map", ".json", ".less",
        ".db",
    ]

    let getFileName = function(x: string) {
        if((x[0] !== ".") || (x[0] === x[0].toUpperCase())) return x
        else return `test.${x}`
    }

    for(let x of suffixes) {
        let filename = getFileName(x)
        let class_name = getClassWithColor(filename)
        console.log(`${filename} -> ${class_name}`)
        document.body.innerHTML = 
            `<div id="ICON" class="${class_name}" 
                  style="width: 256px; height: 256px; transform: scale(12.0) translate(47%, 47%)">
            </div>`
        let icon = document.getElementById("ICON")
        let blob = await domtoimage.toBlob(icon)

        let savename = `icon_${x}.png`
        saveBlob(blob, savename)

        //saveAs(blob,)

        await _sleep(100)
    }

    //let contents = suffixes.map(x => {
        //let filename = getFileName(x)
        //let class_name = getClassWithColor(filename)
        //return `<tr> <td> <div class="${class_name}" style="font-size: 32px"></div> </td> <td>${x}</td> </tr>`
    //})

    //document.body.innerHTML = `<table>${contents.join("")}</table>`
}

document.addEventListener("DOMContentLoaded", main)

