import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

// Polyfill für __dirname in ES-Modulen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "src", "index.html"));
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);
