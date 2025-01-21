//const {app,BrowserWindow,ipcMain,} = require("electron");
//const path = require("path");

import { app, BrowserWindow, ipcMain,dialog} from "electron"
import { fileURLToPath } from 'url';
import path from "path"
import fs from "fs"
import { compareDirectories,assignDirectoryGroup } from "./compare.mjs";
app.commandLine.appendSwitch("--in-process-gpu");
const mode = app.commandLine.getSwitchValue("mode");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.mjs"),
            devTools: mode == "development" ? true : false,
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    //win.loadFile('index.html')
    if (mode === "development") {
        win.loadURL("http://localhost:5173/");
    } else {
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }

    console.log("Current Mode:" + mode);
    //console.log(process.env);
    ipcMain.on("close-window", () => {
        console.log("Close App");
        app.quit();
    });

    ipcMain.on("max-window", () => {
        console.log("max App");
        win.maximize();
    });

    ipcMain.on("min-window", () => {
        console.log("min App");
        win.minimize();
    });

    ipcMain.on("unmax-window", () => {
        console.log("unmax App");
        win.unmaximize();
    });

}

ipcMain.handle('get-home-directory', () => {
    return process.env.HOME || process.env.USERPROFILE || '/';
});

ipcMain.handle('select-directory', async (event,folderPath) => {
    console.log(folderPath)
    if(folderPath === null && fs.existsSync(folderPath)===false){
        folderPath = process.env.HOME || process.env.USERPROFILE || '/';
    }
    const options = {
        properties: ['openDirectory'],
        defaultPath: folderPath
    };
    const result = await dialog.showOpenDialog(options);
    if (!result.canceled) {
        return result.filePaths[0];
    }
    return folderPath;
});

ipcMain.handle('compare-directory', async(event,dirA,dirB)=>{
    return await compareDirectories(dirA,dirB);
})

ipcMain.handle('assignDirectoryGroup',async(event,files,dirA,dirB)=>{
    return await assignDirectoryGroup(files,dirA,dirB)
})

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});