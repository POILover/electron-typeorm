import { ElectronAPI } from '@electron-toolkit/preload'
import { UserAddDTO, UserUpdateDTO } from '@shared/dto/user.dto'
import { UserAndPhotosVO, UserVO } from '@shared/vo/user.vo'
import { ApiResponse } from '@shared/common/response'
import { PhotoVO, SelectAndCopyImageVO } from '@shared/vo/photo.vo'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      selectImage: () => Promise<SelectAndCopyImageVO>
      getUserAndPhotos: (id: number) => Promise<ApiResponse<UserAndPhotosVO>>
      getUserList: () => Promise<ApiResponse<UserVO[]>>
      getUserInfo: (id: number) => Promise<ApiResponse<UserVO>>
      saveUser: (userData: UserUpdateDTO) => Promise<ApiResponse<UserVO>>
      deleteUser: (id: number) => Promise<ApiResponse<void>>
      addUser: (userData: UserAddDTO) => Promise<ApiResponse<UserVO>>
      createPhoto: (photoData: any) => Promise<ApiResponse<PhotoVO>>
    }
  }
}
