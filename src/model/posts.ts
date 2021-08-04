import {
    PrimaryGeneratedColumn,
    Column,
    BaseEntity,
    Entity,
    ManyToOne,
    JoinColumn,
    BeforeInsert,
    BeforeUpdate
} from 'typeorm';

import User from './users';
import { dateFormatter } from '../lib/formatter';

@Entity()
class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    p_id!: number;

    @ManyToOne((type) => User, (user) => user.u_id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @Column('varchar', { comment: '제목' })
    title!: string;

    @Column('varchar', { comment: '내용' })
    content!: string;

    @Column('int', { default: 0, comment: '조회수' })
    lookUp!: number;

    @Column('int', { default: 0, comment: '추천수' })
    recommendation!: number;

    //이미지, site, tag들을 어떻게 처리해야할 지 생각해봐야함.
    /*@Column('string[]')
    site!: string[];

    @Column()
    tag!: string[];*/

    //얘를 isdeleted로 넘길까
    @Column('boolean', { default: true })
    enabled!: boolean;

    @Column('varchar', { comment: '작성일자' })
    writtenDate!: string;

    @Column('varchar', { nullable: true })
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

export default Post;
