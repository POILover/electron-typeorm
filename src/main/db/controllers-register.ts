import { PhotoController } from './photo/photo.controllers'
import { serviceContainer } from './service-container'
import { UserController } from './user/user.controllers'

export const registerControllers = () => {
  new UserController(serviceContainer.userService)
  new PhotoController(serviceContainer.photoService)
}
