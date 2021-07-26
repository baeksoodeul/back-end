export interface searchPostData {
    type: string,
    text: string
}

export interface existingPost {
    title: string,
    ctnt: string,
}

export interface newPost extends existingPost {
    user: User
}
