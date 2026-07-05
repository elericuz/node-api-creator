import { verifyToken } from "../helpers/token.js";

// Verifies the JWT if present and attaches the payload to req.auth.
// Does NOT block — route guards (authMiddleware) enforce access.
export const customMiddleware = (req, res, next) => {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;

    req.auth = token ? verifyToken(token) : null;
    next();
};
