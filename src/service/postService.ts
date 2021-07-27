// import joi from 'joi';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import Post from '../model/posts';
import User from '../model/users';
// import User from '../model/users';

import { existingPost, fileType, newPost, searchPostData } from '../types/post';

// 일단 게시글 정렬은 최신순으로
// 함수를 여러개 쓸 필요가 있을까... 그냥 값을 받아와서 where문만 바꿔주면 되지않을까...
//그냥 이거를 돌려쓰면 안되나. 흠?
export const getPostList = async (): Promise<Post[] | undefined> => {
    try {
        const postList = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post', 'user.nickName'])
            .where('post.enabled = true')
            .getMany();

        return postList;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const getPostDetail = async (data: number): Promise<Post | undefined> => {
    const postId: number = data;

    try {
        const postDetail = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post', 'user.nickName'])
            .where('post.p_id = :id', { id: postId })
            .getOne();

        if (!postDetail) throw new Error('NOT_FOUND');

        return postDetail;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

// searchService를 따로 빼야하나
export const findPostByText = async (data: searchPostData) => {
    let searchText: string = data.type;
    const searchType: string = data.text; // joi 적용해보는거 괜찮을듯

    let condition: string;

    switch (searchType) {
        case 'title':
            condition = "post.title like '%' || :text || '%'";
            break;

        case 'content':
            condition = "post.content like '%' || :text || '%'";
            break;

        case 'writer':
            condition = 'user.nickName = :text';
            break;

        case 'title+content':
            condition =
                "(post.title like '%' || :text || '%' OR post.content like '%' || :text || '%')";
            break;

        default:
            // serarchText를 let으로 바꾸고 빈칸을 주긴 하지만 에러가 뜨지않는다면 굳이 이렇게 할 필요는 없음. 그리고 에러가 뜨더라도 그냥 에러 처리를 해줄수 있다면 상관없지않을까
            condition = "post.title like '%' || :text || '%'";
            searchText = '';
            break;
    }

    try {
        const postList = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select([
                'post.p_id',
                'post.title',
                'post.lookUp',
                'post.recommendation',
                'post.writtenDate',
                'post.site',
                'post.tag',
                'user.u_id',
                'user.nickName'
            ])
            .where(condition, { text: searchText })
            .andWhere('post.enabled: true')
            .orderBy('post.writtenDate', 'DESC') // default
            .getMany();

        return postList;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

//여기에 이미지도 추가해야함... 어떻게? -> 디비에는 이미지 이름을 넣고, 이미지를 불러오는 방법으로 해야함.
export const insertPost = async (post: newPost): Promise<InsertResult | undefined> => {
    const { user, title, ctnt }: newPost = post;
    try {
        const iPost: InsertResult = await Post.createQueryBuilder()
            .insert()
            .into(Post)
            .values({
                user,
                title,
                content: ctnt
            })
            .execute();

        //나중에 한번 돌려봐야할듯
        //console.log(iPost);
        return iPost;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

export const updatePost = async (data: number, post: existingPost) => {
    const postId: number = data;
    const { title, ctnt }: existingPost = post;

    try {
        const uPost: UpdateResult = await Post.createQueryBuilder()
            .update(Post)
            .set({
                title,
                content: ctnt
            })
            .where('post.p_id = :id', { id: postId })
            .execute();

        return uPost;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

export const deletePost = async (data: number) => {
    const postId: number = data;

    try {
        const dPsot: DeleteResult = await Post.createQueryBuilder()
            .delete()
            .from(Post)
            .where('post.p_id = :id', { id: postId })
            .execute();

        return dPsot;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

export const uploadFiles = async (user: User | undefined, file: fileType) => {
    const userInfo: User | undefined = user;
    const file;
};
