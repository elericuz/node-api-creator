'use strict';

import { getEngine } from '../../../../db/index.js';
import { MongoUserRepository } from './mongo/userRepository.js';
import { SqlUserRepository } from './sql/userRepository.js';

let instance = null;

/**
 * Resolves the concrete UserRepository for the active DB_ENGINE.
 * Cached per process — the engine never changes at runtime.
 */
export function getUserRepository() {
    if (instance) return instance;
    instance = getEngine() === 'mongo'
        ? new MongoUserRepository()
        : new SqlUserRepository();
    return instance;
}
