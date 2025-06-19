import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Photo } from '../photo/photo.entities'
import { Exclude } from 'class-transformer'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  username?: string

  @Column({ type: 'text', name: 'real_name' })
  realName!: string

  @Exclude()
  @OneToMany(() => Photo, (photo) => photo.user, { cascade: true })
  photoList!: Photo[] // 这里直接定义了外联列表的字段名
}
