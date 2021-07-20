export interface searchPostData {
    type: string,
    text: string
}

export interface newPost extends existingPost {
    user: User
}

export interface existingPost {
    title: string,
    ctnt: string,
}