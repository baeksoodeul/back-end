//cmt comment 섞어쓰니까 헷갈려서 comment로 통일

export interface existingComment {
    ctnt: string;
}

export interface newComment extends existingComment {
    user: User;
}