const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  queryDB: (sql, params) => ipcRenderer.invoke('query-db', sql, params),
  runDB: (sql, params) => ipcRenderer.invoke('run-db', sql, params),
  showDialog: (message) => ipcRenderer.invoke('show-dialog', message)
});
