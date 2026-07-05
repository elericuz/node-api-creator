// notFoundHandler para rutas no encontradas
import {errorLogger} from '../../../helpers/logger.js';

export const notFoundHandler = (req, res, next) => {
    const err = new Error(`Path Not Found - ${req.originalUrl}`);
    err.status = 404;
    err.path = req.originalUrl;
    next(err);
};

// middleware general de errores
export const errorHandler = (err, req, res, next) => {
    errorLogger(err, req, res, next);

    const isDev = process.env.ENVIRONMENT === 'DEVELOPMENT';

    res.status(err.status || 500).json({
        message: 'Something went wrong',
        // Only expose internals in development — avoid leaking to clients.
        error: isDev ? { message: err.message, path: err.path || req.originalUrl } : undefined,
        success: false
    });
};
