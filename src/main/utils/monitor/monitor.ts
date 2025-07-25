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
  private static instance: IpcMonitor;
  private initialId = 0
  private monitorWindowMap = new Map<number, BrowserWindow>()
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
  private getUuid(){
    return Date.now().toString() + '-' + this.initialId++
  }
  private openMonitorWindow(parentWindowId: number) {
    createMonitorWindow(parentWindowId)
  }
  public wrapIpc() {
    const self = this
    return function (
      channel: string,
      listener: (event: IpcMainInvokeEvent, ...args: any[]) => any
    ) {
      const wrappedListener = async (event: IpcMainInvokeEvent, ...args: any[]) => {
        const parentWindowId = event.sender.id
        const wc = self.monitorWindowMap.get(parentWindowId)?.webContents
        const uuid = self.getUuid();
        wc?.send('monitor:data', {uuid, status: 'pending', args, timestamp: Date.now()})
        const result = await listener(event, ...args)
        
        wc?.send('monitor:data', { uuid, status: 'fullfilled', args, timestamp: Date.now(), result})
        return result
      }

      self.originalHandle(channel, wrappedListener)
    }
  }
  static getInstance(): IpcMonitor {
    if (!IpcMonitor.instance) {
      IpcMonitor.instance = new IpcMonitor();
    }
    return IpcMonitor.instance;
  }
}
export const ipcMonitor = IpcMonitor.getInstance()
export const ipcMonitorHandle = ipcMonitor.wrapIpc()
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
      const list = []
      require('electron').ipcRenderer.on('monitor:data', (_, data) => {
        console.clear()
        if(data.status === 'pending') {
          list.push(data)
        }
        if(data.status === 'fullfilled') {
          const index = list.findIndex(item => item.uuid === data.uuid)
          const pendingData = { ...list[index] }
          if(index !== -1) {
            data.timestamp = data.timestamp - pendingData.timestamp
            list[index] = data
          }
        }
        console.table(list)
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
