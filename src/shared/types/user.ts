import type { PhotoVO } from './photo'
export type UserVO = {
  id: number
  username: string
  realName: string
}

export type UserEditDTO = {
  id?: number
  username: string
  realName: string
}

export type UserAndPhotosVO = UserVO & {
  photoList: PhotoVO[]
}