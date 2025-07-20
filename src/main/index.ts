import 'reflect-metadata'
import { app, BrowserWindow } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { installCustomProtocol, registerCustomProtocol } from './utils/protocol'
import { createWindow } from './utils/main-window'
import { registerControllers } from './db/controllers-register'
import { setAppDataSource } from './db/data-source'
import appDataSource from './db'
import { registerIpcHandlers } from './ipc'
import IpcMonitor from './utils/monitor/monitor'

// register customized protocols, it must be called before creating the window
registerCustomProtocol('app')

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // install custom protocol
  installCustomProtocol('app')
  installCustomProtocol('http')
  // initialize database
  await appDataSource.initialize()
  await appDataSource.runMigrations()
  setAppDataSource(appDataSource)
  // register ipc handlers
  const ipcMonitor = new IpcMonitor()
  registerIpcHandlers()
  registerControllers(ipcMonitor)
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
