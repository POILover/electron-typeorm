import { PhotoCreateDTO } from '@shared/dto/photo.dto'
import { Photo } from './photo.entities'
import { getAppDataSource } from '../data-source'

export class PhotoService {
  createPhoto = async (photo: PhotoCreateDTO) => {
    try {
      const photoRepository = getAppDataSource().getRepository(Photo)
      const newPhoto = photoRepository.create(photo)
      const savedPhoto = await photoRepository.save(newPhoto)
      return savedPhoto

    } catch (error) {
      console.error('添加照片失败', error)
      throw error
    }
  }
}
