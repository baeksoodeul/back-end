// import joi from 'joi';
import { DeleteResult, InsertResult, UpdateResult } from 'typeorm';

import Post from '../model/posts';
import User from '../model/users';
import File from '../model/files';
// import User from '../model/users';

import { existingPost, fileType, newPost, searchPostData } from '../types/post';
import { dateFormatter } from '../lib/formatter';

// 일단 게시글 정렬은 최신순으로
// 함수를 여러개 쓸 필요가 있을까... 그냥 값을 받아와서 where문만 바꿔주면 되지않을까...
//그냥 이거를 돌려쓰면 안되나. 흠?
export const selectPostAll = async () => {
    try {
        const postList = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post', 'user.nickName'])
            .where('post.enabled = true')
            .getMany();

        return postList;
    } catch (err) {
        console.log('error - postService/selectPostAll');
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

//이거좀 수정해야할듯
export const selectDetailedPostById = async (data: number) => {
    const postId: number = data;

    try {
        const postDetail = await Post.createQueryBuilder('post')
            .leftJoin('post.user', 'user')
            .select(['post', 'user.nickName'])
            .where('post.p_id = :id', { id: postId })
            .getOne();

        return postDetail;
    } catch (err) {
        err.message = 'error - postService/selectDetatiledPostById';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

// export const findPostById = async (data: number) => {
//     const postId: number = data;

//     try {
//         const fPost = await Post.createQueryBuilder('post')
//             .select(Post)
//             .where('post.p_id = :id', { id: postId })
//             .getOne();

//         if(!fPost) throw new Error('NOT_FOUND');

//         return fPost;
//     } catch(err) {
//         console.log(err);
//         throw err;
//     }
// }

// searchService를 따로 빼야하나
export const findPostByText = async (data: searchPostData) => {
    let searchText: string = data.text;
    const searchType: string = data.type; // joi 적용해보는거 괜찮을듯

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
                /*'post.site',
                'post.tag',*/
                'user.u_id',
                'user.nickName'
            ])
            .where(condition, { text: searchText })
            .andWhere('post.enabled = true')
            .orderBy('post.writtenDate', 'DESC') // default
            .getMany();

        return postList;
    } catch (err) {
        // console.error(err);
        // throw new err;
    }
};

export const insertPost = async (post: newPost) => {
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

        const fPost = await Post.createQueryBuilder('post')
            .select('post')
            .where('post.p_id = :id', { id: iPost.generatedMaps[0].id })
            .getOne();
        //나중에 한번 돌려봐야할듯, generatedmaps 쓰는것도 좀 아닌것 같은디
        //console.log(iPost);
        return fPost;
    } catch (err) {
        err.message = 'error - postService/insertPost';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

export const updatePost = async (data: number, param: string, ctnt: string) => {
    const postId: number = data;

    try {
        const uPost: UpdateResult = await Post.createQueryBuilder()
            .update(Post)
            .set({
                title: param,
                content: ctnt
            })
            .where('post.p_id = :id', { id: postId })
            .execute();

        const fPost = await Post.createQueryBuilder('post')
            .select('post')
            .where('post.p_id = :id', { id: uPost.generatedMaps[0].id })
            .getOne();
        //나중에 한번 돌려봐야할듯, generatedmaps 쓰는것도 좀 아닌것 같은디
        //console.log(iPost);
        return fPost;
    } catch (err) {
        err.message = 'error - updatePost';
        console.log(err);
        throw new Error('DATABASE_ERROR');
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
        err.message = 'error - postService/deletePost';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

export const getFiles = async (postId: number) => {
    try {
        const files: Array<File> = await File.createQueryBuilder('File')
            .leftJoin('file.post', 'post')
            .select(['file.f_id', 'file.originalname', 'file.size', 'file.idx'])
            .where('post.p_id = :id', { id: postId })
            .andWhere('file.isDeleted = false')
            .orderBy('file.idx', 'DESC')
            .getMany();

        return files;
    } catch (err) {
        err.message = 'error - postService/getFiles';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

//파일(사진) 업로드 기능
// prettier-ignore
export const insertFiles = async (user: User | undefined, post: Post | undefined, files: fileType[]) => {
    const userInfo = user;
    const postInfo = post;
    const fileArr = files;

    try {
        const iFiles: InsertResult[] = [];
        await fileArr.map(async (file: fileType, index) => {
            iFiles[index] = await File.createQueryBuilder()
                .insert()
                .into(File)
                .values({
                    user: userInfo,
                    post: postInfo,
                    fileName: file.filename,
                    originalName: file.originalname,
                    path: file.path,// 이거 path를 파일이름까지 안하고 경로까지만 하면 될것 같은데... 이대로는 파일이름까지,
                    size: file.size,
                    idx: index
                })
                .execute();
        });

        return iFiles;
        
    } catch(err) {
        err.message = 'error - postService/insertFiles'
        console.log(err);
        throw new Error('DATABSE_ERROR');
    }
};

//isDeleted 처리 하는 서비스
export const deleteFiles = async (fileIds: number[]) => {
    try {
        const uFiles: UpdateResult[] = [];
        await fileIds.map(async (fileId: number, index) => {
            uFiles[index] = await File.createQueryBuilder()
                .update(File)
                .set({
                    isDeleted: true,
                    deletedDate: dateFormatter(new Date())
                })
                .where('file.f_id = : id', { id: fileId })
                .execute();
        });

        return uFiles;
    } catch (err) {
        err.message = 'error - postService/deleteFiles';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

//이미 isdeleted는 처리된 상태
//삭제를 어떻게 해야할까...
export const deleteFilesWhileEditingPost = async (postId: number) => {
    try {
        //p_id에 해당하는 post의 모든 사진파일을 삭제.
        const dFiles = await File.createQueryBuilder()
            .leftJoin('file.post', 'post')
            .delete()
            .from(File)
            .where('post.p_id = :id', { id: postId })
            .andWhere('file.isDeleted = false')
            .execute();

        return dFiles;
    } catch (err) {
        err.message = 'error - postService//delteFilesWhileEditingPost';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};
