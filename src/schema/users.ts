import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import Post from './posts';

@Entity()
class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    u_id!: number;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    age!: number;

    @Column()
    sex!: string;

    @Column("simple-array")
    site!: string[];
    //선호 여행지는 몽고디비로 하는게 더 좋지않을까

    @Column()
    introduction!: string;

    @CreateDateColumn()
    createdDate!: Date;
}

export default User;