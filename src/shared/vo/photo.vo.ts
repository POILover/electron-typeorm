export class PhotoVO {
  id!: number
  filename!: string
  path!: string
  source!: string
  isRaw!: boolean
  isRawText!: string
  userId!: number
}
export class SelectAndCopyImageVO {
  originFileName!: string
  filename!: string
  fullPath!: string
  originPath!: string
  filePath!: string
}
