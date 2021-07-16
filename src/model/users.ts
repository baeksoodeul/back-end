import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    u_id!: number;

    @Column({ unique: true, comment: 'userId' })//일반적인 id
    userName!: string;

    @Column({ comment: 'userPassword' })
    password!: string;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column({ length: 12, unique: true })//닉네임
    nickName!: string;

    @Column()
    age!: number;

    @Column()
    sex!: string;

    @Column("simple-array")
    sites!: string[];
    //선호 여행지는 몽고디비로 하는게 더 좋지않을까

    @Column()
    introduction!: string;

    @CreateDateColumn()
    createdDate!: Date;
}

export default User;