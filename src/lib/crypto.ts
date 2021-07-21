import crypto from 'crypto';

export const createSalt = async () => {
    try { 
        const salt: Buffer = await crypto.randomBytes(64);

        if(!salt) {
            throw new Error("SALTING_ERROR");
        }

        return salt.toString('base64');
    }
    catch(err) {
        throw new err;
    }
}

export const createHashedPassword = async (pwd: string) => {
    try {
        const salt: string = await createSalt();
        const hashed: Buffer = await crypto.pbkdf2Sync(pwd, salt, 9999, 64, 'sha512');

        if(!hashed) {
            throw new Error("HASHING_ERROR");
        }

        return { hasehd: hashed.toString('base64'), salt: salt}
    }
    catch(err) {
        throw new err;
    }
}

export const makeHashedPassword = async (pwd: string, salt: string) => {
    try {
        const hashed: Buffer = await crypto.pbkdf2Sync(pwd, salt, 9999, 64, 'sha512');

        if(!hashed) {
            throw new Error("HASHING_ERROR");
        }

        return hashed.toString('base64');
    }
    catch(err) {
        throw new err;
    }
}

export const comparePassword = async (pwd: string, salt: string, hashed: string) => {
    try {
        const inputHashed = await makeHashedPassword(pwd, salt);

        if(inputHashed === hashed) {
            return true;
        }
        else return false;
    }
    catch(err) {
        throw new err;
    }
}