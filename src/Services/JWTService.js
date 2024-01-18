import jwt from "jsonwebtoken";

const privateKey = 'cHJpdmF0ZSBrZXkgdG8gc2lnbiB0b2tlbg==';

const tokenSign = (id) => {
    return jwt.sign({ userId: id }, privateKey);
}

const getUserIdFromToken = (token) => {
    const decode = jwt.verify(token, privateKey);
    return decode.userId;
}

export {
    tokenSign,
    getUserIdFromToken
}