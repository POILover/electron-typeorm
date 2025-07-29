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
        // 说明打开的是监控窗口, id是monitor window的id
        this.monitorWindowMap.set(resolvedTitle.parentWindowId, win)
        win.on('closed', () => {
          this.monitorWindowMap.delete(resolvedTitle.parentWindowId)
        })
        return
      } else {
        // 说明是业务窗口, id是monitor window的父窗口id
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
  private getUuid() {
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
        let result: any
        if (wc) {
          const uuid = self.getUuid();
          wc.send('monitor:data', { uuid, channel, status: 'pending', args, timestamp: performance.now() })
          result = await listener(event, ...args)
          wc.send('monitor:data', { uuid, channel, status: 'fullfilled', args, timestamp: performance.now(), result })
        } else {
          result = await listener(event, ...args)
        }
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
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 20px;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      h1 {
        color: #333;
        text-align: center;
        margin-bottom: 30px;
      }
      .monitor-table {
        width: 100%;
        border-collapse: collapse;
        background-color: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      .monitor-table th {
        background-color: #4CAF50;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
      }
      .monitor-table td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
      }
      .monitor-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .monitor-table tr:hover {
        background-color: #f5f5f5;
      }
      .status {
        padding: 4px 8px;
        border-radius: 4px;
        color: white;
        font-size: 12px;
        font-weight: bold;
      }
      .status.pending {
        background-color: #ff9800;
      }
      .status.fullfilled {
        background-color: #4CAF50;
      }
      .channel {
        font-family: monospace;
        font-size: 13px;
        background-color: #e3f2fd;
        padding: 2px 6px;
        border-radius: 3px;
        color: #1976d2;
      }
      .args {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .result {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .timestamp {
        font-family: monospace;
        font-size: 12px;
      }
      .empty-state {
        text-align: center;
        padding: 40px;
        color: #666;
      }
      .sortable {
        cursor: pointer;
        user-select: none;
        position: relative;
      }
      .sortable:hover {
        background-color: #45a049 !important;
      }
      .sort-indicator {
        display: inline-block;
        margin-left: 5px;
        font-size: 10px;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h1>IPC Monitor</h1>
      <div id="ipc"></div>
    </div>
    <script>
      const list = []
      let sortConfig = { key: null, direction: 'asc' }
      let table = null
      let tbody = null
      let isTableInitialized = false
      
      function initializeTable() {
        const container = document.getElementById('ipc')
        
        table = document.createElement('table')
        table.className = 'monitor-table'
        
        // 创建表头
        const header = table.createTHead()
        const headerRow = header.insertRow()
        const headers = [
          { text: 'UUID', key: null },
          { text: 'Channel', key: null },
          { text: '状态', key: null },
          { text: '参数', key: null },
          { text: '结果', key: null },
          { text: '耗时(ms)', key: 'duration' },
          { text: '时间戳', key: 'timestamp' }
        ]
        headers.forEach(header => {
          const th = document.createElement('th')
          th.textContent = header.text
          if (header.key) {
            th.className = 'sortable'
            th.onclick = () => sortData(header.key)
            
            // 添加排序指示器
            const indicator = document.createElement('span')
            indicator.className = 'sort-indicator'
            if (sortConfig.key === header.key) {
              indicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓'
            } else {
              indicator.textContent = '↕'
            }
            th.appendChild(indicator)
          }
          headerRow.appendChild(th)
        })
        
        // 创建表体
        tbody = table.createTBody()
        
        container.innerHTML = ''
        container.appendChild(table)
        isTableInitialized = true
      }
      
      function createRowElement(item) {
        const row = document.createElement('tr')
        row.setAttribute('data-uuid', item.uuid)
        
        // UUID
        const uuidCell = row.insertCell()
        uuidCell.textContent = item.uuid
        
        // Channel
        const channelCell = row.insertCell()
        const channelSpan = document.createElement('span')
        channelSpan.className = 'channel'
        channelSpan.textContent = item.channel || '-'
        channelCell.appendChild(channelSpan)
        
        // 状态
        const statusCell = row.insertCell()
        const statusSpan = document.createElement('span')
        statusSpan.className = \`status \${item.status}\`
        statusSpan.textContent = item.status === 'pending' ? '进行中' : '已完成'
        statusCell.appendChild(statusSpan)
        
        // 参数
        const argsCell = row.insertCell()
        argsCell.className = 'args'
        argsCell.title = JSON.stringify(item.args, null, 2)
        argsCell.textContent = JSON.stringify(item.args)
        
        // 结果
        const resultCell = row.insertCell()
        resultCell.className = 'result'
        if (item.result !== undefined) {
          resultCell.title = JSON.stringify(item.result, null, 2)
          resultCell.textContent = JSON.stringify(item.result)
        } else {
          resultCell.textContent = '-'
        }
        
        // 耗时
        const durationCell = row.insertCell()
        if (item.status === 'fullfilled' && typeof item.timestamp === 'number') {
          durationCell.textContent = item.timestamp.toFixed(2) + 'ms'
        } else {
          durationCell.textContent = '-'
        }
        
        // 时间戳
        const timestampCell = row.insertCell()
        timestampCell.className = 'timestamp'
        if (item.startTime) {
          const startDate = new Date(item.startTime)
          timestampCell.textContent = startDate.toLocaleString()
        } else {
          timestampCell.textContent = new Date().toLocaleString()
        }
        
        return row
      }
      
      function addRow(item) {
        if (!isTableInitialized) {
          initializeTable()
        }
        
        const row = createRowElement(item)
        tbody.appendChild(row)
      }
      
      function updateRow(item) {
        const existingRow = tbody.querySelector(\`tr[data-uuid="\${item.uuid}"]\`)
        if (existingRow) {
          const newRow = createRowElement(item)
          tbody.replaceChild(newRow, existingRow)
        }
      }
      
      function updateSortIndicators() {
        if (!isTableInitialized) return
        
        const headers = table.querySelectorAll('th.sortable')
        headers.forEach(th => {
          const indicator = th.querySelector('.sort-indicator')
          const headerText = th.textContent.replace(/[↑↓↕]/, '').trim()
          
          if ((headerText === '耗时(ms)' && sortConfig.key === 'duration') ||
              (headerText === '时间戳' && sortConfig.key === 'timestamp')) {
            indicator.textContent = sortConfig.direction === 'asc' ? '↑' : '↓'
          } else {
            indicator.textContent = '↕'
          }
        })
      }
      
      function sortData(key) {
        if (sortConfig.key === key) {
          sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc'
        } else {
          sortConfig.key = key
          sortConfig.direction = 'asc'
        }
        
        list.sort((a, b) => {
          let aVal, bVal
          
          if (key === 'timestamp') {
            aVal = a.startTime || 0
            bVal = b.startTime || 0
          } else if (key === 'duration') {
            aVal = (a.status === 'fullfilled' && typeof a.timestamp === 'number') ? a.timestamp : -1
            bVal = (b.status === 'fullfilled' && typeof b.timestamp === 'number') ? b.timestamp : -1
          }
          
          if (sortConfig.direction === 'asc') {
            return aVal - bVal
          } else {
            return bVal - aVal
          }
        })
        
        renderFullTable()
      }
      
      function renderFullTable() {
        const container = document.getElementById('ipc')
        
        if (list.length === 0) {
          container.innerHTML = '<div class="empty-state">暂无IPC调用记录</div>'
          isTableInitialized = false
          return
        }
        
        initializeTable()
        
        // 重新渲染所有行
        list.forEach(item => {
          const row = createRowElement(item)
          tbody.appendChild(row)
        })
        
        updateSortIndicators()
      }
      
      require('electron').ipcRenderer.on('monitor:data', (_, data) => {
        if(data.status === 'pending') {
          data.startTime = Date.now() // 记录实际开始时间
          list.push(data)
          addRow(data)
        }
        if(data.status === 'fullfilled') {
          const index = list.findIndex(item => item.uuid === data.uuid)
          const pendingData = { ...list[index] }
          if(index !== -1) {
            data.startTime = pendingData.startTime
            data.timestamp = data.timestamp - pendingData.timestamp // 计算耗时
            list[index] = data
            updateRow(data)
          }
        }
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
