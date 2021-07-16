import { PrimaryGeneratedColumn, Column, BaseEntity, Entity, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import User from './users';

@Entity()
class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    p_id!: number;

    @ManyToOne(type => User, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    u_id!: User;

    @Column()
    title!: string;

    @Column()
    content!: string;

    @Column()
    lookUp!: number;

    @Column()
    recommendation!: number;

    @CreateDateColumn()
    writtenDate!: Date;

    @Column()
    site!: string[];

    @Column()
    tag!: string[];

    @Column()
    enabled!: boolean;
    //이미지를 어떻게 넣을지도 생각해야함
    //url을 넘긴다...? 그 많은 url들을 어떻게... string으로 넘겨야 하나..?

    /*
    @Column('sijmple-array')
    images!: string[];
    */
}

export default Post;