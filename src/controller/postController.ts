import { Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { InsertResult } from 'typeorm';
import User from '../model/users';
import File from '../model/files';
// prettier-ignore
import {insertPost, updatePost, deletePost, getPostDetail, getPostList, insertFiles, getFiles, /*findPostById*/} from '../service/postService';
import { findUserByToken } from '../service/userService';
import { fileType, newPost } from '../types/post';
import Post from '../model/posts';

//insert result로 결과를 확인하기 힘들면, insert나 delete후 find로 찾아줘야 한다.
//req.decoded에는 u_id와 username이 들어있다
//image, tag, site 생각해줘야 한다.
//req.files에 이미지 객체 들이 들어있다.
export const writePost: RequestHandler = async (req: any, res, next) => {
    const fNames: Array<string> = req.files.map((file: fileType) => {
        return file.filename;
    });
    const oNames: Array<string> = req.files.map((file: fileType) => {
        return file.originalname;
    });
    const sizes: Array<number> = req.files.map((file: fileType) => {
        return file.size;
    });

    const tokenData: JwtPayload | undefined = req.decoded;
    try {
        const userInfo: User | undefined = await findUserByToken(tokenData);
        if (!userInfo) {
            return res.status(600).json({
                success: false,
                message: 'wrong token'
            });
        }

        const postInfo: newPost = {
            user: userInfo,
            title: req.body.post.title,
            ctnt: req.body.post.content
        };

        const wPost: Post | undefined = await insertPost(postInfo);

        //이것도 나중엔 수정해줘야한다. select 결과로 바꿨으니 괜찮을지도...
        if (!wPost) {
            return res.status(600).json({
                success: false,
                message: '포스팅 등록 실패'
            });
        }

        //req.files는 filetype 객체의 array로 들어오는게 맞다!
        if (req.files.length) {
            const iFiles = await insertFiles(userInfo, wPost, req.files);
        } //insertresults[]가 된다.
        //iFiles를 가지고 또 파일이 제대로 업로드가 되었는지 검증을 할 수 있을까....

        return res.status(200).json({
            success: true,
            message: '포스팅 등록 성공',
            user: userInfo.u_id,
            post: {
                id: wPost.p_id,
                title: wPost.title
            },
            files: req.files,
            createdAt: Date.now()
        });
    } catch (err) {
        next(err);
    }
};

//수정완료
export const editPost: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;
    const postId: number = req.body.post.p_id;
    try {
        const userInfo: User | undefined = await findUserByToken(tokenData);
        //const postInfo: Post | undefined = await findPostById(postId);
        const files: File[] = await getFiles(postId);

        const ePost = await updatePost(postId, req.body.post.newtitle, req.body.post.newctnt);

        if(!ePost) {
            res.status(600).json({
                success: false,
                message: "수정 실패"
            });
        }

        if(!files) { //기존의 첨부파일이 없다는 뜻
            if(req.files.length) {//새로넣을 첨부파일이 있을때
                const iFiles = await insertFiles(userInfo, ePost, req.files);
            }
        }
        else {
            
        }


    } catch(err) {
        next(err);
    }
}

export const removePost: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;

    try {
        //auth를 거치고 오는 함수. 마지막으로 확인문구 같은거만 받으면 될듯.
    } catch(err) {
        next(err);
    }
}

export const postListing: RequestHandler = async (req, res, next) => {
    try {
        const posts = await getPostList();
        if (!posts) {
            return res.status(600).json({
                success: true,
                message: '게시글이 없음',
                data: posts
            });
        }

        return res.status(201).json({
            success: true,
            message: '조회 성공',
            data: posts
        });
    } catch (err) {
        next(err);
    }
};
