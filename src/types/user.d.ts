export interface existingUser {
    pwd: string,
    nick: string,
    fName: string,
    lName: string,
    //age: number,
    //sex: string,
    //mail: string,
    //ph: string,
    sArr: Array<string>,
    intro: string,
}

export interface newUser extends existingUser {
    userId: string,
    salt: string
};