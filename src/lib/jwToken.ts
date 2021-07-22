import jwt, { decode } from 'jsonwebtoken';
import { Token } from 'typescript';

import { findUserByToken } from '../service/userService';

const secretkey = 'azbxcydwev';//config에 집어넣을 내용, + option까지

//토큰 생성
export const generateToken = (id: number, user: string) => {
    const data = {
        u_id: id,
        username: user
    }
    
    try {
        const newToken: string = jwt.sign(data, secretkey, {});
        
        if(!newToken) {
            throw new Error("TOKEN_GENERATING_ERROR");
        }

        return newToken;
    }
    catch(err) {
        //console.log(err);
        //throw new err;
    }
}

//토큰 검증
export const verifyToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, secretkey, {});

        if(!decoded) {
            throw new Error("TOKEN_VERIFYING_ERROR");
        }

        return decoded;
    }
    catch(err) {//위에서 던지는 에러를 잡아낸다
        //console.log(err);
        //throw new err;
    }
}