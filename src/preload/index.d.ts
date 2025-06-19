import { ElectronAPI } from '@electron-toolkit/preload'
import type { UserAndPhotosVO, UserVO, UserEditDTO } from '@shared/types/user'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getUserAndPhotos: (id: number) => Promise<UserAndPhotosVO>
      getUserList: () => Promise<UserVO[]>
      getUserInfo: (id: number) => Promise<UserVO>
      saveUser: (userData: UserEditDTO) => Promise<UserVO>
      deleteUser: (id: number) => Promise<void>
    }
  }
}
