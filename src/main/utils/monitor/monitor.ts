// import { app, globalShortcut } from "electron"
// const shortcut = "Control+Shift+M"
// const shortcutHandler = () => {
//   console.log('monitor window open')
//   // TODO: 创建window(要区分是不是MonitorWindow，要invoke派发数据的handle)
// }
// export default class IpcMonitor {
//   windowIdSet = new Set()
//   constructor(){
//     app.on('browser-window-created', (_, win)=>{
//       // TODO: 如果是MonitorWindow，应该直接return
//       win.on('focus', ()=>{
//         globalShortcut.register(shortcut, shortcutHandler)
//       })
//       win.on('blur', ()=>{
//         globalShortcut.unregister(shortcut)
//       })
//       win.on('closed', ()=>{
//         globalShortcut.unregister(shortcut)
//       })
//     })
//   }
//   ipcHandle(){
//     // TODO: 劫持ipcMain.handle方法
//     // TODO: 注册派发数据handle
//   }
// }
import { randomUUID } from 'crypto'
import { app, globalShortcut, ipcMain, BrowserWindow, IpcMainInvokeEvent } from 'electron'
const MonitorBrowserWindowTitle = 'MONITOR'
const shortcut = 'Control+Shift+M'
const generateBrowserWindowTitle = (parentWindowId: number) => {
  return `${MonitorBrowserWindowTitle}_${parentWindowId}`
}
const resolveBrowserWindowTitle = (id: string) => {
  const [title, parentWindowId] = id.split('_')
  return { title, parentWindowId: Number(parentWindowId) }
}
export default class IpcMonitor {
  private trackedWindowIds = new Set<number>()
  private monitorWindowMap = new Map<number, BrowserWindow>()
  private callLogs: Record<number, any[]> = {}
  private monitorWindowType = 'monitor' // your custom type
  private originalHandle = ipcMain.handle.bind(ipcMain)

  constructor() {
    this.setupWindowLifecycle()
  }

  private setupWindowLifecycle() {
    app.on('browser-window-created', (_, win) => {
      const id = win.id
      const resolvedTitle = resolveBrowserWindowTitle(win.title)
      if (resolvedTitle.title === MonitorBrowserWindowTitle) {
        this.monitorWindowMap.set(resolvedTitle.parentWindowId, win)
        win.on('closed', () => {
          this.monitorWindowMap.delete(id)
        })
        return
      } else {
        win.on('focus', () => {
          globalShortcut.register(shortcut, () => {
            this.openMonitorWindow(id)
          })
        })

        win.on('blur', () => globalShortcut.unregister(shortcut))
        win.on('closed', () => {
          globalShortcut.unregister(shortcut)
        })
      }
    })
  }

  private openMonitorWindow(parentWindowId: number) {
    console.log(`MonitorWindow open for window ${parentWindowId}`)
    // 创建 MonitorWindow，并将 parentWindowId 注入 preload 或 query 参数
    // 你需要自行实现 createMonitorWindow
    createMonitorWindow(parentWindowId)
  }
  // TODO: 这个winId混淆了
  public wrapIpc() {
    const self = this

    // 注册一个 handle 给 MonitorWindow 获取当前日志
    // ipcMain.handle('monitor:getIpcLogs', (_, targetWindowId: number) => {
    //   return self.callLogs[targetWindowId] ?? []
    // })

    return function (
      channel: string,
      listener: (event: IpcMainInvokeEvent, ...args: any[]) => any
    ) {
      const wrappedListener = async (event: IpcMainInvokeEvent, ...args: any[]) => {
        // TODO: 向特定的 MonitorWindow 发送数据
        const parentWindowId = event.sender.id
        const wc = self.monitorWindowMap.get(parentWindowId)?.webContents
        const uuid = randomUUID();
        wc?.send('monitor:data', {uuid, status: 'pending', args, timestamp: Date.now()})
        const result = await listener(event, ...args)
        
        wc?.send('monitor:data', { uuid, status: 'fullfilled', args, timestamp: Date.now(), result})
        return result
      }

      self.originalHandle(channel, wrappedListener)
    }
  }

  /** 在 createWindow 中调用 */
  public markAsMonitoredWindow(win: BrowserWindow) {
    this.trackedWindowIds.add(win.id)
  }
}

const htmlContent = `
<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Monitor</title>
  </head>

  <body>
    <div id="ipc"></div>
    <script>
      require('electron').ipcRenderer.on('monitor:data', (_, data) => {
        console.log(data)
      })
    </script>
  </body>
</html>

`

function createMonitorWindow(targetWindowId: number) {
  const monitorWindow = new BrowserWindow({
    title: generateBrowserWindowTitle(targetWindowId),
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // preload: join(__dirname, '../preload/monitor.js'),
      // additionalArguments: [`--targetWindowId=${targetWindowId}`]
    }
  })
  monitorWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`)
}
