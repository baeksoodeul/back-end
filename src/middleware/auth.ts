import { Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../lib/jwToken';
import { findUserByToken } from '../service/userService';

export const auth: RequestHandler = async (req: any, res, next) => {
    const token = req.cookies.x_auth;
    if (!token) {
        return res.json({
            //토큰이 없음. 로그인이 안되어 있는 상황
        });
    }

    try {
        const decoded = (await verifyToken(token)) as JwtPayload;
        const user = await findUserByToken(decoded);

        if (!user) {
            return res.json({
                //토큰에 담긴 정보가 잘못 됨/
                //res.json을 쓰면 여기서 미들웨어가 끝이나고 다음 라우팅으로 넘어가지 않는다.
            });
        }

        // 로그인이 되어 있음.
        // req
        // auth설정을 true인 상태로 내보내야함.
        req.decoded = decoded;
        req.isAuth = true;

        next();
    } catch (err) {
        // console.log(err);
        next(err);
    }
};
