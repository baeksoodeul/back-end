import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, BeforeInsert } from 'typeorm';

import { dateFormatter } from '../lib/formatter';

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    u_id!: number;

    @Column({ unique: true, comment: '아이디' })//일반적인 id
    userName!: string;

    @Column({ comment: '비밀번호' })
    password!: string;

    @Column({ comment: '이름' })
    firstName!: string;

    @Column({ comment: '성' })
    lastName!: string;

    @Column({ length: 12, unique: true, comment: '닉네임' })
    nickName!: string;

    @Column({ comment: '나이' })
    age!: number;

    @Column({ comment: '성별' })
    sex!: string;

    @Column("simple-array")
    sites!: string[];
    //선호 여행지는 몽고디비로 하는게 더 좋지않을까

    @Column({ default: "", comment: '자기소개' })
    introduction!: string;

    @Column({ comment: '가입일자' })
    joinedDate!: string;

    @BeforeInsert()
    setCreatedDate() {
        this.joinedDate = dateFormatter(new Date());
    }
}

export default User;