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

    @ManyToOne((type) => User, (user) => user.u_id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @ManyToOne((type) => Post, (post) => post.p_id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'p_id', referencedColumnName: 'p_id' })
    post!: Post;

    @Column('int', { comment: '추천수' })
    recommendation!: number;

    @Column('varchar', { comment : '내용'})
    content! : string;

    //답글 기능

    @Column('boolean', { default: true })
    enabled!: boolean;

    @Column('varchar', { comment: '작성일자' })
    writtenDate!: string;

    @Column('varchar')
    updatedDate!: string | null;
    


    
    /*
    @BeforeInsert()
    setWrittenDate(): void {
        this.writtenDate = dateFormatter(new Date());
        this.updatedDate = null;
    }

    @BeforeUpdate()
    setUpdatedDate(): void {
        this.updatedDate = dateFormatter(new Date());
    }*/
}

export default Comment;
