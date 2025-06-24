import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../user/user.entities'
import { Exclude, Expose } from 'class-transformer'

@Entity('photo')
export class Photo {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'text' })
  filename!: string

  @Column({ type: 'text' })
  path!: string

  @Column({ type: 'text' })
  source!: string

  @Column({ type: 'boolean', name: 'is_raw', default: false }) // typeorm会将boolean映射为0/1
  isRaw!: boolean

  @Expose() // 来自 class-transformer 的Expose装饰器, 可以让这个计算字段在序列化时通过getter返回计算结果
  get isRawText(): string {
    return this.isRaw ? '是' : '否'
  }

  @Column({ type: 'text', name: 'alias' }) // 测试数据库迁移
  alias?: string

  @Column({ type: 'integer', name: 'user_id' })
  userId!: number // relations查找会返回这个userId字段

  @Exclude() // 来自 class-transformer 的Exclude装饰器, 可以让这个字段在序列化时不返回
  @ManyToOne(() => User, (user) => user.photoList, { onDelete: 'CASCADE' }) // onDelete: 'CASCADE' 表示当User被删除时, 关联的Photo也会被删除, 这是数据库级别的设置
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' }) // 显式关联外键列名, 这个列名如果上面没定义, sqlite将自动添加, 但vo没有默认字段可返回
  user!: User
}
