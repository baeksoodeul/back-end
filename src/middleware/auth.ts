import { Request, RequestHandler } from 'express';
import { JwtPayload } from 'jsonwebtoken';

import { verifyToken } from '../lib/jwToken';
import User from '../model/users';
import { findUserByToken } from '../service/userService';

export const auth: RequestHandler = async (req: any, res, next) => {
    let user: User | undefined;
    let dcd = req.decoded;

    try {
        if (dcd && req.expires /*dcd가 있고 decoded의 유효기간이 남아있다면*/) {
            user = await findUserByToken(dcd);
        } else {
            const token = req.cookies.x_auth; //쿠키에 대한 갱신도 생각을 해줘야 한다.
            if (!token) {
                //throw error
                return res.json({
                    //decoded가 없는데 쿠키도 없는 상황. => 로그인 X
                });
            }
            //쿠키가 있더라도 잘못된 쿠키라면 여기서 걸림.
            dcd = (await verifyToken(token)) as JwtPayload;
            user = await findUserByToken(dcd);
        }

        if (!user) {
            return res.json({
                //토큰에 담긴 정보가 잘못 됨/
                //res.json을 쓰면 여기서 미들웨어가 끝이나고 다음 라우팅으로 넘어가지 않는다.
            });
        }

        // 로그인이 되어 있음.
        // req
        // auth설정을 true인 상태로 내보내야함.
        req.decoded = dcd;
        req.isAuth = true;

        next();
    } catch (err) {
        // console.log(err);
        next(err);
    }
};
