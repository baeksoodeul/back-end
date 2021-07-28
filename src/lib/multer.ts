import multer from 'multer';
import path from 'path/posix';

//파일을 서버에 업로드하는 역할

const storage = multer.diskStorage({
    destination(req, file, done) {
        done(null, '../uploads/');
    },
    filename(req, file, done) {
        done(null, `Image${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5*1024*1024 }
}).array('img', 20);