import { RequestHandler } from "express";

import { generateToken, verifyToken } from "../lib/jwToken";
import User from "../model/users";
import { findUserById, findUserByToken } from "../service/userService";
import { makeHashedPassword, comparePassword } from "../lib/crypto";
 
/*
    로그인 절차
    1. findUserById: 아이디 검색
    2. generateToken: 있으면 비밀번호 비교 후 토큰생성

    토큰 검증
    -> verifyToken: 있는 토큰이 제대로된 토큰인지 확인하고,
    decode된 값을 db에서 검색해서 올바른지 확인한다.
*/
//로그인
export const userLogin: RequestHandler = async (req, res, next) => {
    try {
        const userData = await findUserById(req.body.id);
        
        if(!userData) {
            res.json({
                //에러가 아닌데 아이디가 없음
            });
        }
        else {
            if(!comparePassword(req.body.password, userData!.salt, userData!.password)) {
                res.json({
                    //비밀번호 오류
                })
            }
            else {//성공, 토큰 생성이 필요
                const token = await generateToken(userData!.u_id, userData!.userName, userData!.nickName);
                res.cookie("x_auth", token)
                .status(200)
                .json({
                    
                })
            }
        }
    }
    catch(err) {
        next(err);
    }
}

//회원가입
export const userJoin: RequestHandler = async (req, res, next) => {

}

//아이디, 비밀번호 찾기