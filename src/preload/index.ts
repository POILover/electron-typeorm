import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UserEditDTO } from '@shared/types/user'
// Custom APIs for renderer
const api = {
  getUserAndPhotos: (id: number) => ipcRenderer.invoke('getUserAndPhotos', id),
  getUserList: () => ipcRenderer.invoke('getUserList'),
  getUserInfo: (id: number) => ipcRenderer.invoke('getUserInfo', id),
  saveUser: (userData: UserEditDTO) => ipcRenderer.invoke('saveUser', userData),
  deleteUser: (id: number) => ipcRenderer.invoke('deleteUser', id)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
