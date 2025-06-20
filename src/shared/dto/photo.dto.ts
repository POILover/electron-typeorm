export class PhotoCreateDTO {
  filename!: string
  path!: string
  source!: string
  isRaw?: boolean = false
  userId!: number
}
