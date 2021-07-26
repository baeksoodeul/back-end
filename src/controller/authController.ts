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

// 회원가입
export const userSignup: RequestHandler = async (req, res, next) => {
    try {
        const { id, password, nickName, lastName, firstName, sites, introduction } = req.body.user;
        // salt가 없는 상태 -> id, password, nickname, lastname, firstname, sites, introduction
        const cryption = (await createHashedPassword(password)) as sObject;
        const userData: newUser = {
            userId: id,
            pwd: cryption.hashed,
            salt: cryption.salt,
            nick: nickName,
            fName: firstName,
            lName: lastName,
            sArr: sites,
            intro: introduction
        };

        const user = await insertUser(userData);
        if (!user) {
            return res.status(600).json({
                success: false,
                message: '회원가입 실패'
            });
        }

        return res.status(201).json({
            success: true,
            message: '회원가입 성공'
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
// 아이디, 비밀번호 찾기
