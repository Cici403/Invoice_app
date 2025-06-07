const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, // This must be true
      contextIsolation: false, // This must be false
      enableRemoteModule: true, // Add this line
    },
  });

  mainWindow.loadFile("src/index.html");
  // mainWindow.webContents.openDevTools() // Uncomment for debugging
}

app.whenReady().then(createWindow);
