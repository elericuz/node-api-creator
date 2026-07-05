// Derives the user id from the VERIFIED token (req.auth), never from a
// client-supplied header. Runs after customMiddleware.
export const userInfo = (req, res, next) => {
    req.uid = req.auth?.uid || null;
    next();
};
