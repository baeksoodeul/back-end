import { RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { InsertResult } from 'typeorm';
import User from '../model/users';
import File from '../model/files';

import {
    insertPost,
    updatePost,
    deletePost,
    getPostDetail,
    getPostList
} from '../service/postService';
import { findUserByToken } from '../service/userService';
import { fileType, newPost } from '../types/post';

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
    })

    const dc: JwtPayload | undefined = req.decoded;
    try {
        const userInfo: User | undefined = await findUserByToken(dc);
        if(!userInfo) {
            return res.status(600).json({
                success: false,
                message: "wrong user"
            })
        }
        const postInfo: newPost = {
            user: userInfo,
            title: req.body.post.title,
            ctnt: req.body.post.content
        };
        const wPost: InsertResult | undefined = await insertPost(postInfo);

        //이것도 나중엔 수정해줘야한다.
        if(!wPost) {
            return res.status(600).json({
                success: false,
                message: '포스팅 등록 실패'
            });
        }

        //이미지들을 files에 집어넣어야함.
        for (let idx in req.files) {
            const iFile = await 
        }


        return res.status(200).json({
            success: true,
            message: '포스팅 등록 성공'
        });
    } catch (err) {
        next(err);
    }
};

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
