import { ipcMain } from 'electron'
import { instanceToPlain } from 'class-transformer' // class-transformer用于将类实例转换为普通对象
import { UserService } from './user.services'
import { UserEditDTO } from '@shared/types/user'

export class UserController {
  constructor(private userService: UserService) {
    this.registerIpcHandlers()
  }

  registerIpcHandlers() {
    ipcMain.handle('getUserList', async () => {
      const userList = this.userService.getUserList()
      return instanceToPlain(userList) // 来自 class-transformer 的 instanceToPlain 方法, 这类转换方法会调用内部序列化方法, 解析并应用实体类中的装饰器
    })
    ipcMain.handle('getUserInfo', async (_, id: number) => {
      const user = this.userService.getUserById(id)
      return instanceToPlain(user)
    })
    ipcMain.handle('getUserAndPhotos', async (_, id: number) => {
      const userPhotoData = this.userService.getUserAndPhotos(id)
      return instanceToPlain(userPhotoData)
    })
    ipcMain.handle('saveUser', async (_, userData: UserEditDTO) => {
      const savedUser = this.userService.saveUser(userData)
      return instanceToPlain(savedUser) 
    })
    ipcMain.handle('deleteUser', async (_, id: number) => {
      await this.userService.deleteUser(id)
    })
  }
}
