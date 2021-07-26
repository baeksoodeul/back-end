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
    }
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const errorMessage: string = err.message in errorList ? err.message : 'INTERNAL_SERVER_ERROR';
    const error: Error = errorList[errorMessage];
    res.status(error.statusCode).json({ msg: error.msg });
};

export default errorHandler;
