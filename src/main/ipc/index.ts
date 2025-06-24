import { SelectAndCopyImageVO } from '@shared/vo/photo.vo'
import { app, dialog, ipcMain } from 'electron'
import fs from 'fs'
import path from 'path'

function normalizePath(filePath: string): string {
  // format path to POSIX style
  return filePath.replace(/\\/g, '/')
}
export const registerIpcHandlers = () => {
  ipcMain.handle('select-and-copy-image', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg', 'gif'] }]
    })

    if (result.canceled || result.filePaths.length === 0) return null

    const originPath = result.filePaths[0]

    const targetDir = path.join(app.getPath('userData'), 'uploads')
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true })
    }

    const originFileName = path.basename(originPath)
    // generate a new filename to avoid duplication
    const timestamp = Date.now()
    const filename = `${timestamp}_${originFileName}`
    const fullPath = path.join(targetDir, filename)
    const filePath = path.join('/uploads/', filename)
    // copy file
    fs.copyFileSync(originPath, fullPath)
    const selectAndCopyImage: SelectAndCopyImageVO = {
      originFileName,
      filename,
      fullPath: normalizePath(fullPath),
      originPath: normalizePath(originPath),
      filePath: normalizePath(filePath)
    }
    return selectAndCopyImage
  })
}
