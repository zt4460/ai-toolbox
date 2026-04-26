const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isElectron: true,
  
  // 版本信息
  getVersion: () => {
    const { app } = require('@electron/remote');
    return app.getVersion();
  },
  
  // 窗口控制
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  
  // 打开外部链接
  openExternal: (url) => ipcRenderer.send('open-external', url),
});
