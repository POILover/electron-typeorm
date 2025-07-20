import { PhotoController } from './photo/photo.controllers'
import { serviceContainer } from './service-container'
import { UserController } from './user/user.controllers'

export const registerControllers = (ipcMonitor) => {
  new UserController(serviceContainer.userService, ipcMonitor)
  new PhotoController(serviceContainer.photoService, ipcMonitor)
}
