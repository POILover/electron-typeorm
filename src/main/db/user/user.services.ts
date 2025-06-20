import { UserAddDTO, UserUpdateDTO } from '@shared/dto/user.dto'
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
  saveUser = async (user: UserUpdateDTO) => {
    const userRepository = getAppDataSource().getRepository(User)
    const savedUser = await userRepository.save(user)
    return savedUser
  }
  addUser = async (user: UserAddDTO) => {
    const userRepository = getAppDataSource().getRepository(User)
    const exists = await userRepository.findOne({ where: { username: user.username } })
    if (exists) {
      throw new Error('用户已存在')
    }
    const newUser = userRepository.create(user)
    const savedUser = await userRepository.save(newUser)
    return savedUser
  }
  deleteUser = async (id: number) => {
    const userRepository = getAppDataSource().getRepository(User)
    await userRepository.delete(id)
  }
}
