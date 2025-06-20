import type { PhotoVO } from '../vo/photo.vo'
export class UserVO {
  id!: number
  username!: string
  realName!: string
}

export class UserAndPhotosVO extends UserVO {
  photoList!: PhotoVO[]
}
