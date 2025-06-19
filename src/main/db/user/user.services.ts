import { getAppDataSource } from '../data-source'
import { User } from './user.entities'
export class UserService {
  constructor() {}
  getUserAndPhotos = async (id: number) => {
    const userRepository = getAppDataSource().getRepository(User)
    const userPhotoData = await userRepository.findOne({
      where: { id },
      relations: ['photoList']
    })
    return userPhotoData
  }
}
