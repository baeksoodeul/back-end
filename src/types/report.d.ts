import User from "../model/users";
import Post from "../model/posts";
import Comment from "../model/comments";

export interface newReport {
    user: User,
    type: "post" | "comment",
    object: Post | Comment,
    ctg: string, //이것도 항목 정해주장
    rs: string
}