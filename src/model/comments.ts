import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

import User from './users';
import Post from './posts';
import { dateFormatter } from '../lib/formatter';


@Entity()
class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    c_id!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    user!: User;

    @ManyToOne(type => Post, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'p_id', referencedColumnName: 'p_id'})
    post!: Post;

    @Column()
    recommendation!: number;


    //답글 기능

    @Column({ default: true })
    enabled!: boolean;

    @Column()
    writtenDate!: string;

    @Column()
    updatedDate!: string | null;

    @BeforeInsert()
    setWrittenDate() {
        this.writtenDate = dateFormatter(new Date());
        this.updatedDate = null;
    }

    @BeforeUpdate()
    setUpdatedDate() {
        this.updatedDate = dateFormatter(new Date());
    }
}

export default Comment;