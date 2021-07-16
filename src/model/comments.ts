import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import User from './users';
import Post from './posts';


@Entity()
class Comment extends BaseEntity {
    @PrimaryGeneratedColumn()
    c_id!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    u_id!: User;

    @ManyToOne(type => Post, { onDelete: 'CASCADE', nullable: false})
    @JoinColumn({name: 'p_id', referencedColumnName: 'p_id'})
    p_id!: Post;

    @Column()
    recommendation!: number;

    //답글 기능

    @CreateDateColumn()
    writtenDate!: Date;
}

export default Comment;