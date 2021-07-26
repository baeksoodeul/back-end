import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
    BeforeInsert
} from 'typeorm';

import { dateFormatter } from '../lib/formatter';

@Entity()
class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    u_id!: number;

    @Column({ unique: true, comment: '아이디' }) //일반적인 id
    userName!: string;

    @Column({ comment: '비밀번호' })
    password!: string;

    @Column({ comment: 'salt' })
    salt!: string;

    //이름이랑 성 배열 하나로 합치는것도 괜찮을듯
    @Column({ comment: '이름' })
    firstName!: string;

    @Column({ comment: '성' })
    lastName!: string;

    @Column({ length: 12, unique: true, comment: '닉네임' })
    nickName!: string;

    //@Column({ comment: '나이' })
    //age!: number;

    //@Column({ comment: '성별' })
    //sex!: string;

    //@Column({ comment: '전화번호' }) //ex: LGU010XXXXXXXX
    //phone!: string;

    //@Column({ comment: '이메일' })
    //email!: string;

    @Column('simple-array')
    sites!: string[];
    //선호 여행지는 몽고디비로 하는게 더 좋지않을까

    //어드민 구별하는 것도 생각해야함. isAdmin
    @Column({ default: '', comment: '자기소개' })
    introduction!: string;

    @Column({ comment: '가입일자' })
    joinedDate!: string;

    @BeforeInsert()
    setCreatedDate() {
        this.joinedDate = dateFormatter(new Date());
    }
}

export default User;
