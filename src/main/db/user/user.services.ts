import { UserEditDTO } from '@shared/types/user'
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
  getUserList = async () => {
    const userRepository = getAppDataSource().getRepository(User)
    const userList = await userRepository.find()
    return userList
  }
  getUserById = async (id: number) => {
    const userRepository = getAppDataSource().getRepository(User)
    const user = await userRepository.findOne({ where: { id } })
    return user
  }
  saveUser = async (user: UserEditDTO) => {
    const userRepository = getAppDataSource().getRepository(User)
    const savedUser = await userRepository.save(user)
    return savedUser
  }
  deleteUser = async (id: number) => {
    const userRepository = getAppDataSource().getRepository(User)
    await userRepository.delete(id)

  }
}
