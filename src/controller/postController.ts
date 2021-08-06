/* eslint-disable no-lonely-if */
import { RequestHandler } from 'express';
import fs from 'fs';
import { JwtPayload } from 'jsonwebtoken';
import User from '../model/users';
// prettier-ignore
import {insertPost, updatePost, deletePost, selectDetailedPostById, selectPostAll, insertFiles, getFiles, deleteFilesWhileEditingPost, deleteFiles, /*findPostById*/} from '../service/postService';
import { findUserByToken } from '../service/userService';
import { fileType, newPost } from '../types/post';
import Post from '../model/posts';

/**
 * POST /api/post/write
 * @summary write new post
 * @tag Post
 * @param req
 * @param res
 * @returns
 * @returns {Error} -error
 */
//insert result로 결과를 확인하기 힘들면, insert나 delete후 find로 찾아줘야 한다.
//req.decoded에는 u_id와 username이 들어있다
//image, tag, site 생각해줘야 한다.
//req.files에 이미지 객체 들이 들어있다.
export const writePost: RequestHandler = async (req: any, res, next) => {
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

/**
 * POST /api/post/{postId}/edit => 이게 되나
 * @param req
 * @param res
 * @param next
 * @returns
 */
//수정완료 버튼 => multer가 실행된 이후이다.
export const editPost: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;
    const postId: number = req.body.post.p_id;
    const cnt = req.body.post.fCount;
    const del = req.body.post.deleted;
    try {
        const userInfo: User | undefined = await findUserByToken(tokenData);
        if (!userInfo) {
            return res.status(600).json({
                success: false,
                message: '잘못된 유저 정보'
            });
        }

        const ePost: Post | undefined = await updatePost(
            postId,
            req.body.post.newtitle,
            req.body.post.newctnt
        );

        if (!ePost) {
            return res.status(600).json({
                success: false,
                message: '포스팅 수정 실패'
            });
        }
        //이 부분이 너무 난잡한것 같은데 함수를 따로 빼버릴까...
        //isDeleted처리해줘야할 부분.
        if (!del.length) {
            const isDels = deleteFiles(req.body.deleted);
        }

        //fCount: 파일의 수
        if (!cnt) {
            //기존의 첨부파일이 없다는 뜻
            if (req.files.length) {
                //새로넣을 첨부파일이 있을때
                const iFiles = await insertFiles(userInfo, ePost, req.files);
            }
        } else {
            //기존의 첨부파일이 있을 때
            //서버에 있는 파일 삭제. 여기서 getfiles를 통해 서버에 저장된 파일 이름을 가져와 삭제해야함.
            //const files = await getFiles(postId);
            (await getFiles(postId)).map(async (file, index) => {
                fs.unlink(file.fileName, function cb(err) {
                    if (err) throw err;
                }); //file.path
                console.log('file deleted');
            });

            if (req.files.length) {
                //몇개가 삭제되고 몇개가 추가되었을 경우,
                //기존의 레코드들을 삭제
                const dFiles = await deleteFilesWhileEditingPost(postId);
                //레코드들을 새롭게 삽입
                const iFiles = await insertFiles(userInfo, ePost, req.files);
            } else {
                //기존의 모든 첨부파일이 삭제될 때
                //이때는 모든 파일들이 isdeleted처리가 되기 때문에 할 동작이 없음.
            }
        }

        //오류검사는 나중에 생각하자.
        return res.status(200).json({
            success: true,
            message: '포스팅 수정 성공',
            user: userInfo.u_id,
            post: {
                id: ePost.p_id,
                title: ePost.title
            },
            files: req.files,
            updatedAt: Date.now()
        });
    } catch (err) {
        next(err);
    }
};

export const removePost: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;

    try {
        //auth를 거치고 오는 함수. 마지막으로 확인문구 같은거만 받으면 될듯.
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/board/posts
 * @summary get list of post
 * @tag Board
 * @returns {Array<Post>} 200 - Success response - application/json
 * @returns {Error} - database error
 */
export const getPostList: RequestHandler = async (req, res, next) => {
    try {
        const posts = await selectPostAll();

        return res.status(201).json({
            success: true,
            message: '조회 성공',
            data: posts
        });
    } catch (err) {
        //서비스에서 에러가 난다면 -> DATABASE_ERROR라는 에러가 바로 에러 핸들러로 갈것.
        next(err);
    }
};

/**
 * GET /api/post/:postId/detail
 * @summary get detail content of post
 * @tag Post
 * @param {number}
 * @returns {Post} 20X -success response
 * @returns {Error} 40X - Invalid Parameter
 * returns {Error} 500 - database error
 */
export const getPostDetail: RequestHandler = async (req, res, next) => {
    //패러미터 에러가 생길수도 있음 여기서.
    const value: number = parseInt(req.params.postId, 10);

    //service function으로 넘길때, 인자를 검사하고 넘겨주는게 맞는것 같다... => 인자로 인한 오류는 여기서 잡고 감.
    //service에서 생기는 error는 데이터베이스 에러밖에 없다!
    try {
        const post = await selectDetailedPostById(value);

        if(!post) {
            throw new Error('NOT_FOUND');
        }

        return res.status(201).json({
            success: true,
            message: '조회 성공',
            data: post
        });
    } catch (err) {
        //서비스에서 에러가 생긴다면 DATABASE_ERROR가 next로 바로 넘어감.
        //그게 아닌데 에러가 나온다면 다른 에러가 넘어갈것.
        next(err);
    }
};
