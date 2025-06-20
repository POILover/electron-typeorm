import { PhotoService } from './photo/photo.services'
import { UserService } from './user/user.services'
function singleton<T>(factory: () => T): () => T {
  let instance: T | undefined
  return () => (instance ??= factory())
}

const getUserService = singleton(() => new UserService())
const getPhotoService = singleton(() => new PhotoService())
export const serviceContainer = {
  get userService() {
    return getUserService()
  },
  get photoService() {
    return getPhotoService()
  }
}
