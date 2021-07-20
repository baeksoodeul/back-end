import { PrimaryGeneratedColumn, Column, BaseEntity, Entity, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

import User from './users';
import { dateFormatter } from '../lib/formatter';
import { truncate } from 'fs';

@Entity()
class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    p_id!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column({ default: 0 })
    lookUp!: number;

    @Column({ default: 0 })
    recommendation!: number;

    @Column()
    site!: string[];

    @Column()
    tag!: string[];

    @Column({ default: true })
    enabled!: boolean;

    @Column()
    writtenDate!: string;

    @Column({ nullable: true })
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