'use strict';

import * as userService from '../services/userService.js';

// Expose the message only for explicit HTTP errors (4xx we threw on purpose).
// Unexpected 500s stay generic so internals never leak to the client.
const fail = (res, err) => {
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        message: status === 500 ? 'Internal server error' : err.message,
    });
};

export const create = async (req, res) => {
    try {
        res.status(201).json({ success: true, data: await userService.registerUser(req.body) });
    } catch (err) {
        fail(res, err);
    }
};

export const getById = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: await userService.getUser(req.params.id) });
    } catch (err) {
        fail(res, err);
    }
};

export const list = async (req, res) => {
    try {
        res.status(200).json({ success: true, data: await userService.listUsers(req.query) });
    } catch (err) {
        fail(res, err);
    }
};
