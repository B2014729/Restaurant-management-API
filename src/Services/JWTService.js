import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const privateKey = process.env.JWT_PRIVATE_KEY;

const tokenSign = (id) => {
    return jwt.sign({ userId: id }, privateKey);
}

const getUserIdFromToken = (token) => {
    const decode = jwt.verify(token, privateKey);
    return decode.userId;
}

export {
    tokenSign,
    getUserIdFromToken,
}