import dotenv from 'dotenv';

const envPath = process.env.NODE_ENV !== 'production' ? '.env.dev' : '.env';
//dotenv.config는 해당 path에 들어있는 경로의 환경변수 설정을 process.env로 넘겨 준다
dotenv.config({ path: envPath });