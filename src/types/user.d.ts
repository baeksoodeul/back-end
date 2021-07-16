export interface existingUser {
    pwd: string,
    nick: string,
    fName: string,
    lName: string,
    age: number,
    sex: string,
    sites: Array<string>,
    intro: string,
}

export interface newUser extends existingUser {
    id: string,
};