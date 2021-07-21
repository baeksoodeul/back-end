import express from 'express';
import errorHandler from './lib/errorHandler';
import { logger, loggerStream } from './lib/logger';
import { ConnectionOptions, createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import "reflect-metadata";
import './env';
import router from './routes'; 

const {
    NODE_ENV,
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    DB_PORT
} = process.env;

const connectOptions: ConnectionOptions = {
    type: "mysql",
    host: DB_HOST,//"localhost",
    port: parseInt(DB_PORT as string, 10),//3306,
    username: DB_USER,//"test",
    password: DB_PASSWORD,//"test",
    database: DB_NAME,//"test",
    synchronize: true,
    logging: true,
    entities: [
        "./schema/*.ts"
    ]
}

const dbInit = async () => {
    try {
        await createConnection(connectOptions);
        console.log("DB connected");
    }
    catch(error) {
        console.log(error);
    }
}


const app: express.Application = express();
const morganEnv = NODE_ENV !== 'production' ? 'dev' : 'combined';

app.set('port', 3000);
app.use(cors());//cors
app.use(cookieParser());//쿠키파서
app.use(morgan(morganEnv, {stream: loggerStream}));//log
app.use('/', express.static(path.join(__dirname + 'public')));//static file
app.use(express.json());//json 인식(?)
app.use(express.urlencoded({extended : false})); //url encoding

//controller
app.use(router);
app.use(errorHandler);

//db연동
dbInit();

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중입니다.');
})