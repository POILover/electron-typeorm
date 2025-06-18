import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Photo } from '../photo/photo.entities';

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text' })
    username?: string;

    @Column({ type: 'text', name: 'real_name' })
    realName!: string;

    @OneToMany(() => Photo, photo => photo.user)
    photoList!: Photo[]; // 这里直接定义了外联列表的字段名

}