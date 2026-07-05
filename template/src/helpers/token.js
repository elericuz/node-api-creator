import jwt from "jsonwebtoken";
import lodash from "lodash";
const _ = lodash;

const maxAge = 30 * 24 * 60 * 60;
export const createToken = (user) => {
    return jwt.sign(
        {
            firstname: user.firstName,
            lastname: user.lastName,
            email: user.email,
            displayName: user.displayName,
            uid: user.uid,
            userType: "user",
            status: user.status
        },
        process.env.JWT_KEY,
        {
            expiresIn: maxAge
        }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_KEY, { algorithms: ['HS256'] });
    } catch {
        return null;
    }
};

export const obscureToken = (token) => {
    if (_.isString(token) && token.length > 8) {
        const firstPart = token.slice(0, 4);
        const lastPart = token.slice(-4);

        const totalObscuredLength = token.length - 8;
        const reducedLength = Math.ceil(totalObscuredLength * 1 / 7);
        const obscuredPart = _.repeat('*', reducedLength);

        return `${firstPart}${obscuredPart}${lastPart}`;
    }

    return token;
};