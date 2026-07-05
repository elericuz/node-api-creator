'use strict';

export const TABLE = 'users';

/**
 * Ensures the `users` table exists.
 *
 * ⚠️ Reference-only convenience so the example runs out of the box without a
 * migration step. In a REAL project, delete this and use proper Knex
 * migrations (a `knexfile.js` + `npx knex migrate:latest`). Auto-creating
 * schema at runtime is fine for a starter, not for production.
 */
export async function ensureUsersTable(db) {
    const exists = await db.schema.hasTable(TABLE);
    if (exists) return;

    await db.schema.createTable(TABLE, (t) => {
        t.increments('id').primary();
        t.string('name').notNullable();
        t.string('email').notNullable().unique();
        t.timestamp('created_at').defaultTo(db.fn.now());
    });
}
