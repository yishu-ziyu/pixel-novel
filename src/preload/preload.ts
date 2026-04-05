import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  loadScript: (scriptPath: string) => ipcRenderer.invoke('load-script', scriptPath),
});
