import { verifyToken } from "../helpers/token.js";

// Route guard: requires a valid JWT, otherwise responds 401.
// Usage: router.use(authMiddleware)  — or per-route.
export const authMiddleware = (req, res, next) => {
    const header = req.header('Authorization') || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    req.user = payload;
    next();
};
