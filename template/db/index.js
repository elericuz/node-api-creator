'use strict';

/**
 * Database connection factory.
 *
 * Resolves the active engine from DB_ENGINE (mongo | postgres | mysql) and
 * exposes a uniform lifecycle: connect() / getClient() / disconnect().
 *
 * The concrete client differs per engine (a Mongoose connection or a Knex
 * instance). Business code never touches this directly — repositories do.
 */

const DB_ENGINE = (process.env.DB_ENGINE || 'mongo').toLowerCase();

const engineLoaders = {
    mongo: () => import('./engines/mongo.js'),
    postgres: () => import('./engines/postgres.js'),
    mysql: () => import('./engines/mysql.js'),
};

let client = null;

export function getEngine() {
    return DB_ENGINE;
}

export async function connect() {
    const loader = engineLoaders[DB_ENGINE];
    if (!loader) {
        throw new Error(`Unsupported DB_ENGINE "${DB_ENGINE}". Use: mongo | postgres | mysql`);
    }
    const engine = await loader();
    client = await engine.connect();
    return client;
}

export function getClient() {
    if (!client) {
        throw new Error('Database not connected. Call connect() before getClient().');
    }
    return client;
}

export async function disconnect() {
    if (!client) return;
    const engine = await engineLoaders[DB_ENGINE]();
    await engine.disconnect(client);
    client = null;
}
