import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import Post from '../model/posts';
import User from '../model/users';
import { newUser, existingUser } from '../types/user';

//리스트에서 넘어가는 방식.... 리스트에서 값을 프런트로 넘길 수 있다면? 굳이 select를 해줄 필요가 있을까...
export const getUserList = async () => {
    
}

//존나 위험하지 않을까....
export const getUserDetail = async (data: number, admin: boolean) => {
    const userId: number = data;
    let selectArr: Array<string>;
    if(admin) {
        selectArr = ['user'];
    }
    else {
        selectArr= ['user.nickName', 'user.introduction'];
    }

    try {
        const userDetail = await User
            .createQueryBuilder('user')
            .select(selectArr)
            .where('user.u_id = :id', { id: userId })
            .getOne();
        
        if(!userDetail) throw new Error('NOT_FOUND');

        return userDetail;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

//create, update, delete
export const createUser = async (user: newUser) => {
    const { id, pwd, nick, fName, lName, age, sex, sites, intro }: newUser = user;

    try{
        const iUser: InsertResult = await User
            .createQueryBuilder()
            .insert()
            .into(User)
            .values({
                userName: id,
                password: pwd,
                nickName: nick,
                firstName: fName,
                lastName: lName,
                age: age,
                sex: sex,
                sites: sites,
                introduction: intro
            })
            .execute();
        
        return iUser;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

export const updateUser = async (data: number, user: existingUser) => {
    const userId: number = data;
    const { pwd, nick, fName, lName, age, sex, sites, intro }: existingUser = user;

    try {
        const uUser: UpdateResult = await User
            .createQueryBuilder()
            .update(User)
            .set({
                password: pwd,
                nickName: nick,
                firstName: fName,
                lastName: lName,
                age: age,
                sex: sex,
                sites: sites,
                introduction: intro
            })
            .where("user.u_id = :id", { id: userId })
            .execute();

        return uUser;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}

export const deleteUser = async (data: number) => {
    const userId: number = data;

    try {
        const dUser: DeleteResult = await User
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("user.u_id = :id", { id: userId })
            .execute();

        return dUser;
    }
    catch(err) {
        //console.error(err);
        //throw new err;
    }
}