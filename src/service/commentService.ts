import { DeleteResult, InsertResult, UpdateResult } from "typeorm";

import User from '../model/users';
//import Post from '../model/posts';
import Comment from '../model/comments';

import { existingComment, newComment } from "../types/comment";
import { dateFormatter } from "../lib/formatter";

export const insertComment = async (comment : newComment) => {
    const {user, ctnt} :newComment = comment;
    try {
        const iComment : InsertResult = await Comment.createQueryBuilder()
            .insert()
            .into(Comment)
            .values({
                user,
                content : ctnt
            })
            .execute();

        const fComment = await Comment.createQueryBuilder('comment')
            .select('comment')
            .where('comment.c_id = :id', {id: iComment.generatedMaps[0].id})
            .getOne();
            /*c_id니까 댓글 하나만*/
        return fComment;

    } catch (err) {
        err.message = 'error - commentService/insertComment';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

export const updateComment = async (data : number, comment : existingComment) => {
    const commentId: number = data;
    const {ctnt} : existingComment = comment;
    /* 이거 existing으로 수정하면 commentController.ts도
    세 개의 인자가 아니라 두개(number+객체 하나) 이렇게 묶어줘야하나?
    아마 그럴듯 나중에 물어보고 수정 .. */

    try {
        const uComment: UpdateResult = await Comment.createQueryBuilder()
            .update(Comment)
            .set({
                content: ctnt
            })
            .where('comment.c_id = :id', {id: commentId})
            .execute();

        const fComment = await Comment.createQueryBuilder('comment')
        .select('comment')
        .where('comment_id= :id', {id: uComment.generatedMaps[0].id})
        .getOne();

        return fComment;
    } catch (err) {
        err.message = 'error - commentService/updateComment';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};

export const deleteComment = async (data: number) => {
    const commentId: number = data;

    try {
        const dComment: DeleteResult = await Comment.createQueryBuilder()
        .delete()
        .from(Comment)
        .where('comment.c_id= :id', {id: commentId})
        .execute();

        return dComment;
    } catch (err) {
        err.message = 'error - commentService/deleteComment';
        console.log(err);
        throw new Error('DATABASE_ERROR');
    }
};
/* 댓글검색 기능은 필요 없을거 같아서 다 뺐는데
내 댓글 보기는 필요할 거 같다

*/