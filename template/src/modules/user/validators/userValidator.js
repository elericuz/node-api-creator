import { body, validationResult } from 'express-validator';

export const createUserRules = [
    body('name').isString().trim().notEmpty().isLength({ max: 120 }),
    body('email').isEmail().normalizeEmail(),
];

export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
        });
    }
    next();
};
