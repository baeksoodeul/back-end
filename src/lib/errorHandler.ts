import { ErrorRequestHandler } from 'express';
import { Error } from '../types/error';

const errorList: { [key: string]: Error } = {
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        msg: 'Internal Server Error'
    },
    NOT_FOUND: {
        statusCode: 404,
        msg: 'Not Found'
    },
    INVALID_PARAMETER: {
        statusCode: 404,
        msg: 'Invalid Parameter'
    },
    //service에서 생긴 에러, 대충 잡아내면 나중에 internal server error로 합쳐도될듯?
    DATABASE_ERROR: {
        statusCode: 500,
        msg: 'Database Error'
    }
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const errorMessage: string = err.message in errorList ? err.message : 'INTERNAL_SERVER_ERROR';
    const error: Error = errorList[errorMessage];
    res.status(error.statusCode).json({
        success: false,
        msg: error.msg
    });
};

export default errorHandler;
