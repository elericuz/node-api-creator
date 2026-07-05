'use strict';

import { getUserRepository } from '../repositories/index.js';

/**
 * Business logic for the user module.
 *
 * Notice: this file has ZERO knowledge of Mongo, Postgres or MySQL. It only
 * talks to the UserRepository contract. That is why it never changes when you
 * switch DB_ENGINE — and why it is trivial to unit-test with a fake repo.
 */

export const registerUser = async ({ name, email } = {}) => {
    if (!name || !email) {
        const err = new Error('Both "name" and "email" are required');
        err.status = 400;
        throw err;
    }

    const repo = getUserRepository();

    if (await repo.findByEmail(email)) {
        const err = new Error('Email already in use');
        err.status = 409;
        throw err;
    }

    return repo.create({ name, email });
};

export const getUser = async (id) => {
    const user = await getUserRepository().findById(id);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        throw err;
    }
    return user;
};

export const listUsers = async ({ limit, offset } = {}) => {
    return getUserRepository().list({
        limit: Math.min(Number(limit) || 20, 100),
        offset: Number(offset) || 0,
    });
};
