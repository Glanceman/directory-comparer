//const { contextBridge, ipcRenderer } = require("electron");

import { contextBridge, ipcRenderer } from "electron"

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

contextBridge.exposeInMainWorld("$ipc", {
  closeWindow: () => ipcRenderer.send("close-window"),
  minWindow: () => ipcRenderer.send("min-window"),
  maxWindow: () => ipcRenderer.send("max-window"),
  unMaxWindow: () => ipcRenderer.send("unmax-window"),
});


contextBridge.exposeInMainWorld("directoryApi",{
  getHomeDirectory: () =>
    ipcRenderer.invoke('get-home-directory'),
  selectDirectory: path =>
    ipcRenderer.invoke('select-directory', path),
  compareDirectories: (dirA,dirB)=>
    ipcRenderer.invoke('compare-directory',dirA,dirB)
})