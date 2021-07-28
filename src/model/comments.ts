import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    BaseEntity,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';

import User from './users';
import Post from './posts';
import { dateFormatter } from '../lib/formatter';

@Entity()
class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    c_id!: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @ManyToOne(() => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'p_id', referencedColumnName: 'p_id' })
    post!: Post;

    @Column({comment: '추천수'})
    recommendation!: number;

    //답글 기능

    @Column({ default: true })
    enabled!: boolean;

    @Column({comment: '작성일자'})
    writtenDate!: string;

    @Column()
    updatedDate!: string | null;

    @BeforeInsert()
    setWrittenDate(): void {
        this.writtenDate = dateFormatter(new Date());
        this.updatedDate = null;
    }

    @BeforeUpdate()
    setUpdatedDate(): void {
        this.updatedDate = dateFormatter(new Date());
    }
}

export default Comment;
