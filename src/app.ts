import express from 'express';
import { ConnectionOptions, createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { logger, loggerStream } from './lib/logger';
import errorHandler from './lib/errorHandler';
import 'reflect-metadata';
import './env';
import router from './routes';

//const { NODE_ENV, DB_HOST, DB_NAME, DB_USER, DB_PASSWORD, DB_PORT } = process.env;

const connectOptions: ConnectionOptions = {
    type: 'mysql',
    host: 'localhost', // DB_HOST,
    port: 3306, // parseInt(DB_PORT as string, 10),
    username: 'test', // DB_USER,
    password: 'test', // DB_PASSWORD,
    database: 'test', // DB_NAME,
    synchronize: true,
    logging: true,
    entities: [path.join(__dirname, '/model/*.ts')]
};

const dbInit = async () => {
    try {
        await createConnection(connectOptions);
        console.log('DB connected');
    } catch (error) {
        console.error(error);
    }
};

const app = express();
const morganEnv = 'dev'; //NODE_ENV !== 'production' ? 'dev' : 'combined';

app.set('port', 3000);
app.use(cors()); // cors
app.use(cookieParser()); // 쿠키파서
app.use(morgan(morganEnv, { stream: loggerStream })); // log
app.use('/', express.static(path.join(`${__dirname}public`))); // static file
app.use(express.json()); // json 인식(?)
app.use(express.urlencoded({ extended: false })); // url encoding

// controller
app.use('/api', router);
app.use(errorHandler);

// db연동
dbInit();

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중입니다.');
});
