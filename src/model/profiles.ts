import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import User from "./users";

//user를 user, profile, sites로 나누는건 나중에 transaction을 이용해서 짜자... 일단은 내비두자
@Entity()
class Profile extends BaseEntity {
    @PrimaryColumn()
    @OneToOne(type => User)
    @JoinColumn({name: 'u_id', referencedColumnName: 'u_id'})
    user!: User;

    @Column({ comment: '이름, 성' })
    name!: string[]

    @Column({ length: 12, unique: true, comment: '닉네임' })
    nickName!: string;

    @Column({ comment: '나이' })
    age!: number;

    @Column({ comment: '성별' })
    sex!: string;

    @Column({ comment: '전화번호' }) //ex: LGU010XXXXXXXX
    phone!: string;

    @Column({ comment: '이메일' })
    email!: string;

    @Column({ default: "", comment: '자기소개' })
    introduction!: string;
}