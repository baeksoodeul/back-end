import { RequestHandler } from 'express';

import { generateToken, verifyToken } from '../lib/jwToken';
import { insertUser, findUserById } from '../service/userService';
import { comparePassword, createHashedPassword, sObject } from '../lib/crypto';
import { newUser } from '../types/user';

/*
    로그인 절차
    1. findUserById: 아이디 검색
    2. generateToken: 있으면 비밀번호 비교 후 토큰생성

    토큰 검증
    -> verifyToken: 있는 토큰이 제대로된 토큰인지 확인하고,
    decode된 값을 db에서 검색해서 올바른지 확인한다.
*/
// 로그인
export const userLogin: RequestHandler = async (req, res, next) => {
    //이미 로그인이 되어있을 경우를 대비해야함. 이미 로그인 되어 있을때, 로그인 시도가 있을 경우 그냥 로그아웃 시켜서 반환시킴. => 이후 다시 재 로그인(?)
    if (req.cookies.x_auth !== '') {
        return res.clearCookie('x_auth').status(60).json({
            success: false,
            message: 'now logged out. try again'
        });
    }
    try {
        const userData = await findUserById(req.body.user.id);

        if (!userData) {
            return res.json({
                // 에러가 아닌데 아이디가 없음
            });
        }

        if (!comparePassword(req.body.password, userData?.salt, userData?.password)) {
            return res.json({
                // 비밀번호 오류
            });
        }
        // 성공, 토큰 생성이 필요
        const token = await generateToken(userData?.u_id, userData?.userName);

        // 어드민인지 확인해봐야함.
        return res.cookie('x_auth', token).status(200).json({});
    } catch (err) {
        next(err);
    }
};

/**
 *
 * @param req
 * @param res
 * @returns {JSON}
 */
// 회원가입
//회원가입도 로그인 되어 있을때는 못하도록 막아야 하나... 이거는 얘기를 해봐야할듯
export const userSignup: RequestHandler = async (req, res, next) => {
    try {
        //패러미터 검증 해주면 될듯함.
        const { id, password, nickName, lastName, firstName, /*sites,*/ introduction } =
            req.body.user;
        // salt가 없는 상태 -> id, password, nickname, lastname, firstname, sites, introduction
        const cryption = (await createHashedPassword(password)) as sObject;
        const userData: newUser = {
            userId: id,
            pwd: cryption.hashed,
            salt: cryption.salt,
            nick: nickName,
            fName: firstName,
            lName: lastName,
            //sArr: sites,
            intro: introduction
        };

        const user = await insertUser(userData);

        //딱히 실행은 안됨. 어차피 디비 에러는 서비스에서 잡아주기 때문에 크게 없을듯.
        if (!user) {
            throw new Error('INTERNAL_SERVER_ERROR');
        }

        return res.status(201).json({
            success: true,
            message: '회원가입 성공',
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// 로그아웃
export const userLogout: RequestHandler = async (req: any, res, next) => {
    try {
        if (req.isAuth === false) {
            return res.json({
                success: false,
                error: 'already logged out'
            });
        }
        // req.decoded = 현재 로그인되어 있는 유저의 정보
        // req.isAuth = true
        return res.clearCookie('x_auth').status(200).json({
            success: true,
            isAuth: false
            // isAdmin?
        });
    } catch (err) {
        next(err);
    }
};
// 아이디, 비밀번호 찾기(나중에 구현)
