import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Photo } from '../photo/photo.entities'
import { Expose } from 'class-transformer'

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text', unique: true })
  username?: string

  @Column({ type: 'text', name: 'real_name' })
  realName!: string

  @Expose({ groups: ['detail'] }) // 只有在序列化时有相应的group才会暴露这个字段 only expose when serialized with the corresponding group
  @OneToMany(() => Photo, (photo) => photo.user, { cascade: true })
  photoList!: Photo[] // 这里直接定义了外联列表的字段名
}
