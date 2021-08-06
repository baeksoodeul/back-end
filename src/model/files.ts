import {
    BaseEntity,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from 'typeorm';
import { dateFormatter } from '../lib/formatter';
import Post from './posts';
import User from './users';

@Entity()
class File extends BaseEntity {
    @PrimaryGeneratedColumn()
    f_id!: number;

    @ManyToOne((type) => User, (user) => user.u_id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @ManyToOne((type) => Post, (post) => post.p_id, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'p_id', referencedColumnName: 'p_id' })
    post!: Post;

    //필드를 넣어야 하려나... -> 썸네일 및 용도 구분

    @Column('varchar', { comment: '서버에 저장될 파일 이름' })
    fileName!: string;

    @Column('varchar', { comment: '게시자가 올리는 파일 이름' })
    originalName!: string;

    @Column('varchar', { comment: '파일이 저장될 경로' })
    path!: string;

    @Column('int', { comment: '파일크기' })
    size!: number;

    //idx가 0이면 썸네일, 그 다음부터는 순서대로
    @Column('int', { comment: '게시물 내 사진의 순서' })
    idx!: number;

    @Column('varchar', { comment: '업로드 날짜' })
    uploadedDate!: string;

    @Column('boolean', { default: false, comment: '삭제 여부' })
    isDeleted!: boolean;

    @Column('varchar', { default: null, comment: '삭제 날짜', nullable: true })
    deletedDate!: string;

    @BeforeInsert()
    setUploadedDate(): void {
        this.uploadedDate = dateFormatter(new Date());
    }
}

export default File;
