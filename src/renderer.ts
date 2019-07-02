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
        ".asp", ".asp", ".aspx", ".ascx", ".ashx",
        ".awk", ".gawk", ".mawk", ".nawk", 
        ".bat", ".cmd", ".sh", ".reg", 
        ".bin", ".dat",
        ".bison", ".l", ".y",
        ".c", ".cxx", ".cpp", ".h", ".hpp", ".cc", ".hh", ".in", ".cmake", "CMakeLists.txt", "Makefile", ".mk",
        ".coq", 
        ".cs", ".fs", ".vb", ".rc", ".csproj", ".fsproj", ".vcxproj", ".vbproj", ".sln", ".props", ".targets", ".csx", ".fsx", ".nuspec",
        ".css", ".html", ".htm", ".json", ".less", ".scss", ".styl",
        ".csv", ".tsv", 
        ".g", ".g4",
        ".ino",
        ".java", ".scala", ".php",
        ".ll", ".asm", ".o", ".s",
        ".md", ".rst", "README", ".asciidoc", "Doxyfile",
        ".ml", ".hs",
        ".ps1", ".psd1", ".psm1", ".ps1xml",
        ".pub", ".key",
        ".py", ".ipy", ".ipynb", ".pl", ".rb", 
        ".rs", ".go", ".pas", ".vala", ".v", ".vhdl", 
        ".scm", ".rkt", ".cl", ".el", ".lisp", ".clj", ".sexp",
        ".settings", ".config", ".reg", ".yml", ".conf", ".metadata", ".ini",
        ".sql", ".sparql",
        ".svg", 
        ".tex", ".cls", ".ltx", ".aux", ".sty", ".ps", ".cbx", ".bbx", ".bib", ".bst",
        ".tmLanguage",
        ".ts", ".js", ".js.map", ".coffee", ".re", ".jsx",
        ".vim",
        ".xml", ".xaml", ".xsd", ".gml", 

        ".txt",

        ".git", ".gitignore", ".github",
    ]

    let getFileName = function(x: string) {
        if((x[0] !== ".") || (x[0] === x[0].toUpperCase())) return x
        else return `test.${x}`
    }

    for(let x of suffixes) {
        let filename = getFileName(x)
        let class_name = getClassWithColor(filename)

        if (x === ".txt") class_name = "text-icon"

        console.log(`${filename} -> ${class_name}`)
        document.body.innerHTML = 
            `<div id="ICON" class="${class_name}" 
                  style="width: 256px; height: 256px; transform: scale(12.0) translate(47%, 47%); filter: saturate(2.0)">
            </div>`
        let icon = document.getElementById("ICON")
        let blob = await domtoimage.toBlob(icon)


        let savename = `${x}.png`
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
