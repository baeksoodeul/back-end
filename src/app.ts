import express from 'express';
import errorHandler from './lib/errorHandler';
import morgan from 'morgan';
import path from 'path';
import "reflect-metadata";

import { ConnectionOptions, createConnection } from 'typeorm';


const connectOptions: ConnectionOptions = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
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

app.set('port', process.env.PORT || 3000);


app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname + 'public')));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

//controller
app.use(errorHandler);
//db연동
dbInit();

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중입니다.');
})