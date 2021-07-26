import { Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../lib/jwToken';
import { findUserByToken } from '../service/userService';

export const auth: RequestHandler = async (req: any, res, next) => {
    try {
        const token = req.cookies.x_auth;
        const decoded = (await verifyToken(token)) as JwtPayload;
        const user = await findUserByToken(decoded);

        if (!user) {
            return res.json({
                // 로그인이 안되어 있음
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
