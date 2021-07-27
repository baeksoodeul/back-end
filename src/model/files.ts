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

    @ManyToOne((type) => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @ManyToOne((type) => Post, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'p_id', referencedColumnName: 'p_id' })
    post!: Post;

    //필드를 넣어야 하려나... -> 썸네일 및 용도 구분

    @Column()
    fileName!: string;

    @Column()
    originalName!: string;

    @Column()
    path!: string;

    @Column()
    size!: number;

    @Column()
    uploadedDate!: string;

    @BeforeInsert()
    setUploadedDate(): void {
        this.uploadedDate = dateFormatter(new Date());
    }
}

export default File;
