import { contextBridge, ipcRenderer } from 'electron'

const targetId = (() => {
  const arg = process.argv.find((arg) => arg.startsWith('--targetWindowId='))
  return arg ? parseInt(arg.split('=')[1], 10) : -1
})()

contextBridge.exposeInMainWorld('monitorAPI', {
  getLogs: () => ipcRenderer.invoke('monitor:getIpcLogs', targetId),
  getArgs: (cb) =>
    ipcRenderer.on('monitor:data', (_, data) => {
      console.log('preload data:', data)
      cb(data)
    })
})
