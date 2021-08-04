import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import User from './users';

//user를 user, profile, sites로 나누는건 나중에 transaction을 이용해서 짜자... 일단은 내비두자
/*@Entity()
class Profile extends BaseEntity {
    @PrimaryColumn()
    @OneToOne((type) => User, (user) => user.u_id)
    @JoinColumn({ name: 'u_id', referencedColumnName: 'u_id' })
    user!: User;

    @Column('string', { comment: '이름, 성' })
    name!: string[];

    @Column('string', { length: 12, unique: true, comment: '닉네임' })
    nickName!: string;

    @Column('int', { comment: '나이' })
    age!: number;

    @Column('string', { comment: '성별' })
    sex!: string;

    @Column('string', { comment: '전화번호' }) //ex: LGU010XXXXXXXX
    phone!: string;

    @Column('string', { comment: '이메일' })
    email!: string;

    @Column('string', { default: '', comment: '자기소개' })
    introduction!: string;
}*/
