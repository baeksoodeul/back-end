import { RequestHandler } from 'express';
import { Like } from 'typeorm';
import joi from 'joi';

import Post from '../model/posts';
import User from '../model/users';

//일단 게시글 정렬은 최신순으로
//함수를 여러개 쓸 필요가 있을까... 그냥 값을 받아와서 where문만 바꿔주면 되지않을까...

/*export const searchByTitle: RequestHandler = async(req, res, next) => {
    const searchTitle = req.params.searchText;
    //const order = req.params.order;

    try {
        //const postList: Post[] = await Post.find({
        //    where: {
        //        title: Like(`%${searchTitle}%`),
        //        enabled: true,
        //    },
        //    select: [
        //        'p_id', 'title', 'content', 'lookUp', 'recommendation', 'writtenDate',
        //    ],
        //});
        const postList = await Post.createQueryBuilder('post')
            .leftJoin('')

        res.status(201).json(postList);
    }
    catch(err) {
        next(err);
    }
}*/

/*export const searchByWriter: RequestHandler = async(req, res, next) => {
    const searchWriter = req.params.searchText;

    try {
        const postList = await Post
            .createQueryBuilder('post')
            .leftJoin('post.u_id', 'user')
            .select(['post.p_id', 'post.title', 'post.content', 'post.lookUp', 'post.recommendation', 'post.writtenDate', 'user.nickName'])
            .where('user.nickName = :search', { search: searchWriter})
            .andWhere('post.enabled: true')
            .orderBy('post.writtenDate')
            .getMany();


        res.status(201).json(postList);
    }
    catch(err) {
        next(err);
    }
}*/

/*export const searchByContent: RequestHandler = async(req, res, next) => {

}*/

export const searchByDate: RequestHandler = async (req, res, next) => {

}

export const searchByTag: RequestHandler = async (req, res, next) => {

}

export const searchBySite: RequestHandler = async (req, res, next) => {
    
}

export const searchByText: RequestHandler = async (req, res, next) => {
    let searchText: string = req.params.searchText;
    const searchType: string = req.params.searchType; //joi 적용해보는거 괜찮을듯

    let condition: string;

    switch(searchType){
        case 'title':
            condition = "post.title like '%' || :text || '%'";
            break;

        case 'content':
            condition = "post.content like '%' || :text || '%'";
            break;

        case 'writer':
            condition = "user.nickName = :text";
            break;

        case 'title+content':
            condition = "(post.title like '%' || :text || '%' OR post.content like '%' || :text || '%')";
            break;

        default://serarchText를 let으로 바꾸고 빈칸을 주긴 하지만 에러가 뜨지않는다면 굳이 이렇게 할 필요는 없음. 그리고 에러가 뜨더라도 그냥 에러 처리를 해줄수 있다면 상관없지않을까
            condition = "post.title like '%' || :text || '%'";
            searchText = "";
            break;
    }

    try {
        const postList = await Post
            .createQueryBuilder('post')
            .leftJoin('post.u_id', 'user')
            .select(['post.p_id', 'post.title', 'post.lookUp', 'post.recommendation', 'post.writtenDate', 'user.u_id', 'user.nickName'])
            .where(condition, { text: searchText} )
            .andWhere('post.enabled: true')
            .orderBy('post.writtenDate', 'DESC')//default
            .getMany();

        res.status(201).json(postList);
    }
    catch(err) {
        next(err);
    }
}