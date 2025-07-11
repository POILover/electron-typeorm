import { ipcMain } from 'electron'
import { instanceToPlain } from 'class-transformer' // class-transformer用于将类实例转换为普通对象
import { UserService } from './user.services'
import { UserAddDTO, UserUpdateDTO } from '@shared/dto/user.dto'
import { ApiResponseFactory } from '@shared/common/response'
import { handleErrorToResponse } from '@shared/common/error'

export class UserController {
  constructor(private userService: UserService) {
    this.registerIpcHandlers()
  }

  registerIpcHandlers() {
    ipcMain.handle('getUserList', async () => {
      const userList = await this.userService.getUserList()
      return ApiResponseFactory.ok(instanceToPlain(userList)) // 来自 class-transformer 的 instanceToPlain 方法, 这类转换方法会调用内部序列化方法, 解析并应用实体类中的装饰器
    })
    ipcMain.handle('getUserInfo', async (_, id: number) => {
      const user = await this.userService.getUserById(id)
      return ApiResponseFactory.ok(instanceToPlain(user))
    })
    ipcMain.handle('getUserAndPhotos', async (_, id: number) => {
      const userPhotoData = await this.userService.getUserAndPhotos(id)
      return ApiResponseFactory.ok(instanceToPlain(userPhotoData, { groups: ['detail'] }))
    })
    ipcMain.handle('saveUser', async (_, userData: UserUpdateDTO) => {
      try {
        const savedUser = await this.userService.saveUser(userData)
        return ApiResponseFactory.ok(instanceToPlain(savedUser))
      } catch (error) {
        return handleErrorToResponse(error)
      }
    })
    ipcMain.handle('addUser', async (_, userData: UserAddDTO) => {
      try {
        const savedUser = await this.userService.addUser(userData)
        return ApiResponseFactory.ok(instanceToPlain(savedUser))
      } catch (error) {
        return handleErrorToResponse(error)
      }
    })
    ipcMain.handle('deleteUser', async (_, id: number) => {
      await this.userService.deleteUser(id)
      return ApiResponseFactory.ok(null)
    })
  }
}
