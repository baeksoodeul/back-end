import { RequestHandler } from 'express';
import {JwtPayload} from 'jsonwebtoken';
import User from '../model/users';
import Comment from '../model/comments';

import { insertComment, updateComment, deleteComment } from '../service/commentService';
import { findUserByToken } from '../service/userService';
import { newComment, existingComment } from '../types/comment';

export const writeComment: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;
    const commentId: number = req.body.comment.c_id;
    const del = req.body.comment.deleted;
    try{
        const userInfo: User | undefined = await findUserByToken(tokenData);

        /*const userInfo: User하면 user의 자료형으로 설정되는 거고, 
        아니면 토큰으로 찾음. 근데 User 이렇게 하면 알아서 fUser하는거임?
        => findUserByToken이 userService안에 있는 함수
        결론 : User이거나 findUserByToken의 undefined인 type
        그럼 User는 어디서 나온겨*/

        if(!userInfo) {
            return res.status(600).json({
                success: false,
                message: 'wrong token'
            });
        }

        const commentInfo: newComment = {
            user: userInfo, 
            ctnt: req.body.comment.content
        };

        const wComment: Comment | undefined = await insertComment(commentInfo);

        if(!wComment) {
            return res.status(600).json({
                success: false,
                message: '댓글 등록 실패'
            });
        }

        return res.status(200).json({
            success: true,
            message: '댓글 등록 성공',
            user: userInfo.u_id,
            comment: {
                id: wComment.c_id
            },
            createdAt: Date.now()
        });
    } catch (err) {
        next(err);
    }
};

export const editComment: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;
    const commentId: number = req.body.comment.c_id;
    const del = req.body.deleted;
    try {
        const userInfo: User | undefined = await findUserByToken(tokenData);
        if(!userInfo) {
            return res.status(600).json({
                success: false,
                message: 'wrong token'
            });
        }

        const eComment: Comment| undefined = await updateComment(
            commentId,
            req.body.comment.newctnt
        );

        if(!eComment) {
            return res.status(600).json({
                success: false,
                message: '댓글 수정 실패'
            });
        }

        return res.status(200).json({
            success: true,
            message: '댓글 수정 성공',
            user: userInfo.u_id,
            comment: {
                id: eComment.c_id,
            },
            updatedAt: Date.now()
        });
    } catch (err) {
        next(err);
    }
};

export const removeComment: RequestHandler = async (req: any, res, next) => {
    const tokenData: JwtPayload | undefined = req.decoded;

    try {
        /*확인문구를 받고 삭제하란 뜻인가?
        어케.. 하는ㄱ..거지?
        res.sendfile(path /~~.html)이런식으로 해야하나
        근데 이렇게 하면 새 페이지가 열리는거 아닌감 알림말고
        흠
        */
    } catch (err) {
        next(err);
    }
};

/* getComments? 해당 post의 댓글 가져오는 함수 하나 */