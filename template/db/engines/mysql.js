'use strict';

import knex from 'knex';

export async function connect() {
    const client = knex({
        client: 'mysql2',
        connection: {
            host: process.env.SQL_HOST,
            port: Number(process.env.SQL_PORT) || 3306,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            ssl: process.env.SQL_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
        },
        pool: { min: 2, max: 10 },
    });

    // Fail fast if credentials are wrong or the server is unreachable.
    await client.raw('SELECT 1');
    console.log('\x1b[32m✅ [DB] MySQL connected\x1b[0m');
    return client;
}

export async function disconnect(client) {
    await client.destroy();
}
