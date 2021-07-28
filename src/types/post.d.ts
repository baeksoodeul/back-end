export interface searchPostData {
    type: string;
    text: string;
}

export interface existingPost {
    title: string;
    ctnt: string;
}

export interface newPost extends existingPost {
    user: User;
}

export interface fileType {
    fieldname: string;
    originalname: string;
    filename: string;
    path: string;
    size: number;
    destination: string;
    mimetype: string;
    encoding: string;
}
