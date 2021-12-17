import { Jwt, JwtPayload } from 'jsonwebtoken';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';
import File from '../model/files';
import Post from '../model/posts';

// import Post from '../model/posts';
import User from '../model/users';
import { newUser, existingUser } from '../types/user';

// 로그인 시 토큰 발급용
export const findUserById = async (data: string) => {
    const userName = data;

    try {
        // select 결과가 없으면 빈 값이 날아가겠지. 이건 위에서 잡아주면 될듯, 여기에 닉네임이 필요할까?
        const fUser = await User.createQueryBuilder('user')
            .select(['user.u_id', 'user.userName', 'user.password', 'user.salt'])
            .where('user.username = :id', { id: userName })
            .getOne();

        return fUser;
    } catch (err) {
        console.log(err);
        throw err;
    }
};
// decoded 타입은 나중에 다시 생각
export const findUserByToken = async (decoded: JwtPayload | undefined) => {
    const tokenData: JwtPayload = decoded as JwtPayload;

    try {
        const fUser = await User.createQueryBuilder('user')
            .select('user')
            .where('user.u_id = :id', { id: tokenData.u_id })
            .andWhere('user.userName = :user', { user: tokenData.userName })
            .getOne();

        return fUser;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

// 리스트에서 넘어가는 방식.... 리스트에서 값을 프런트로 넘길 수 있다면? 굳이 select를 해줄 필요가 있을까...
// export const getUserList = async () => {

// }

// 존나 위험하지 않을까....
export const getUserDetail = async (data: number, admin: boolean): Promise<User | undefined> => {
    const userId: number = data;
    let selectArr: Array<string>;
    if (admin) {
        selectArr = ['user'];
    } else {
        selectArr = ['user.nickName', 'user.introduction'];
    }

    try {
        const userDetail = await User.createQueryBuilder('user')
            .select(selectArr)
            .where('user.u_id = :id', { id: userId })
            .getOne();

        if (!userDetail) throw new Error('NOT_FOUND');

        return userDetail;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

export const getMyPosts = async (decoded: JwtPayload | undefined) => {
    const tokenData: JwtPayload = decoded as JwtPayload;

    try {
        const posts: Post[] = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post.p_id', 'user.u_id'])
            .where('user.u_id = :id', { id: tokenData.u_id })
            .orderBy('post.writtenDate', 'DESC')
            .getMany();

        return posts;
    } catch (err) {
        console.log(err);
        throw new err();
    }
};

//일단 사진만 생각하자, 이외의 첨부파일은 나중에 생각
export const getMyPhotos = async (decoded: JwtPayload | undefined) => {
    const tokenData: JwtPayload = decoded as JwtPayload;

    try {
        //이렇게 뽑으면 썸네일에 해당하는 사진도 같이 뽑힌다. 이것도 얘기를 한번 나눠봐야할듯.
        const files: File[] = await File.createQueryBuilder('file')
            .leftJoin('file.user', 'user')
            .leftJoin('file.post', 'post')
            .select(['user.u_id', 'post.p_id', 'file.path', 'file.idx'])
            .where('user.u_id = :id', { id: tokenData.u_id })
            .orderBy('file.uploadedDate', 'DESC')
            .addOrderBy('idx', 'DESC')
            .getMany();

        return files;
    } catch (err) {
        console.log(err);
        throw err();
    }
};

// insert, update, delete
// 아이디, 닉네임 중복 검사를 만들면 되지 않을까...
// 회원가입, 해당 계정이 있는지부터 체크해야함.
export const insertUser = async (user: newUser) => {
    const { userId, pwd, salt, nick, fName, lName, /*sArr,*/ intro }: newUser = user;

    try {
        const iUser: InsertResult = await User.createQueryBuilder()
            .insert()
            .into(User)
            .values({
                userName: userId,
                password: pwd,
                salt,
                nickName: nick,
                firstName: fName,
                lastName: lName,
                // age: age,
                // sex: sex,
                // email: mail,
                // phone: ph,
                //sites: sArr,
                introduction: intro
            })
            .execute();

        //console.log(iUser);
        return iUser;
    } catch (err) {
        console.log('error - userService/insertUser');
        throw new Error('DATABASE_ERROR');
    }
};
// 해당 계정이 있는지부터 체크해야함. => 근데 사실 update는 로그인 되어있는 상태에서 하기 때문에 auth로 넘기면 될듯?
export const updateUser = async (data: number, user: existingUser) => {
    const userId: number = data;
    const { pwd, nick, fName, lName, /* age, sex, mail, ph, sArr,*/ intro }: existingUser = user;

    try {
        const uUser: UpdateResult = await User.createQueryBuilder()
            .update(User)
            .set({
                password: pwd,
                nickName: nick,
                firstName: fName,
                lastName: lName,
                // age: age,
                // sex: sex,
                // email: mail,
                // phone: ph,
                //.sites: sArr,
                introduction: intro
            })
            .where('user.u_id = :id', { id: userId })
            .execute();

        return uUser;
    } catch (err) {
        console.log('error - userService/updateUser');
        throw new Error('DATABASE_ERROR');
    }
};

// 이것도 auth 거쳐야함.
export const deleteUser = async (data: number): Promise<DeleteResult | undefined> => {
    const userId: number = data;

    try {
        const dUser: DeleteResult = await User.createQueryBuilder()
            .delete()
            .from(User)
            .where('user.u_id = :id', { id: userId })
            .execute();

        return dUser;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

export const getMyComments = async (decoded: JwtPayload | undefined ) => {
    const tokenData: JwtPayload = decoded as JwtPayload;

    try {
        const comments: Comment[] = await Comment.createQueryBuilder('comment')
        .leftjoin('comment.user', 'user')
        .leftjoin('comment.post', 'post')
        .select(['post.p_id', 'comment.c_id', 'user.u_id'])
        .where('user.u_id = :id', {id: tokenData.u_id})
        .orderBy('comment.writtenDate', 'DESC')
        .getMany();

        return comments;
    } catch (err) {
        console.log(err);
        throw new err();
    }
};