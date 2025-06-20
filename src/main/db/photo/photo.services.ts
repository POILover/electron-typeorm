import { PhotoCreateDTO } from '@shared/dto/photo.dto'
import { Photo } from './photo.entities'
import { getAppDataSource } from '../data-source'

export class PhotoService {
  createPhoto = async (photo: PhotoCreateDTO) => {
    const photoRepository = getAppDataSource().getRepository(Photo)
    const newPhoto = photoRepository.create(photo)
    const savedPhoto = await photoRepository.save(newPhoto)
    return savedPhoto
  }
}
