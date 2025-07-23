import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { UserUpdateDTO } from '@shared/dto/user.dto'
import { PhotoCreateDTO } from '@shared/dto/photo.dto'
// Custom APIs for renderer
const api = {
  selectImage: () => ipcRenderer.invoke('select-and-copy-image'),
  getUserAndPhotos: (id: number) => ipcRenderer.invoke('getUserAndPhotos', id),
  getUserList: () => ipcRenderer.invoke('getUserList'),
  getUserInfo: (id: number) => ipcRenderer.invoke('getUserInfo', id),
  saveUser: (userData: UserUpdateDTO) => ipcRenderer.invoke('saveUser', userData),
  deleteUser: (id: number) => ipcRenderer.invoke('deleteUser', id),
  addUser: (userData: UserUpdateDTO) => ipcRenderer.invoke('addUser', userData),
  createPhoto: (photoData: PhotoCreateDTO) => ipcRenderer.invoke('createPhoto', photoData),
  createTimeout: (timeout: number) => ipcRenderer.invoke('timeout', timeout),
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
