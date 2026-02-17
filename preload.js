const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Example of exposing a version number safely
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});