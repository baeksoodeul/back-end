import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, AfterInsert } from 'typeorm';
import User from './users';
import Post from './posts';
import Comment from './comments';

import { dateFormatter } from '../lib/formatter';

//유저가 탈퇴하거나 게시물, 게시글을 삭제하면 해당정보는 날아가더라도 신고 자체는 삭제 X 그렇다면 그냥 join을 풀어버리고 내역으로 남기는게 나으려나?
//OR cascade옵션을 안 걸면 자동삭제되지는 않으니 상관없으려나??
@Entity()
class Report extends BaseEntity {
    @PrimaryGeneratedColumn()
    r_id!: number;

    //신고자
    @ManyToOne(type => User)
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    user!: User;

    //foreign key도 null일 수 있다
    @ManyToOne(type => Post, {nullable: true})
    @JoinColumn({name: 'p_id', referencedColumnName: 'p_id'})
    post!: Post;

    @ManyToOne(type => Comment, {nullable: true})
    @JoinColumn({name: 'c_id', referencedColumnName: 'c_id'})
    comment!: Comment;

    @Column()
    category!: string;

    @Column()
    reason!: string;

    //신고에 대한 처벌 여부
    @Column({ default: false })
    infliction!: boolean;

    //신고에 대한 답변도 필요할까?

    @Column()
    reportedDate!: string;

    @Column({ nullable: true })
    managedDate!: string | null;

    @BeforeInsert()
    setReportedDate() {
        this.reportedDate = dateFormatter(new Date());
        this.managedDate = null;
    }
}

export default Report;