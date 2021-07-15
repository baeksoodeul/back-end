import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './users';
import Post from './posts';
import Comment from './comments';

@Entity()
class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    r_id!: number;

    @ManyToOne(type => User, {nullable: false})
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    u_id!: User;

    //foreign key도 null일 수 있다
    @ManyToOne(type => Post, {nullable: true})
    @JoinColumn({name: 'p_id', referencedColumnName: 'p_id'})
    p_id!: Post;

    @ManyToOne(type => Comment, {nullable: true})
    @JoinColumn({name: 'c_id', referencedColumnName: 'c_id'})
    c_id!: Comment;

    @Column()
    reason!: string;

    @CreateDateColumn()
    reportedDate!: Date;
}

export default Report;