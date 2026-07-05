'use strict';

import { UserRepository } from '../userRepository.js';
import { getClient } from '../../../../../db/index.js';
import { TABLE, ensureUsersTable } from '../../models/sql/userSchema.js';

// Normalize a SQL row into a plain domain object (snake_case -> camelCase).
const toDomain = (row) => row && ({
    id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
});

// Ensure the table exists once per process (see note in userSchema.js).
let schemaReady = null;

export class SqlUserRepository extends UserRepository {
    get db() {
        return getClient();
    }

    async ready() {
        if (!schemaReady) schemaReady = ensureUsersTable(this.db);
        return schemaReady;
    }

    async create(data) {
        await this.ready();
        const payload = { name: data.name, email: data.email.toLowerCase() };

        // Knex `returning` works on PostgreSQL but is IGNORED by MySQL, which
        // returns the auto-increment id instead. Handle both shapes, then
        // re-fetch so every engine returns the same domain object.
        const inserted = await this.db(TABLE).insert(payload, ['id']);
        const first = inserted[0];
        const id = (first && typeof first === 'object') ? first.id : first;

        return this.findById(id);
    }

    async findById(id) {
        await this.ready();
        const row = await this.db(TABLE).where({ id }).first();
        return toDomain(row);
    }

    async findByEmail(email) {
        await this.ready();
        const row = await this.db(TABLE).where({ email: email.toLowerCase() }).first();
        return toDomain(row);
    }

    async list({ limit = 20, offset = 0 } = {}) {
        await this.ready();
        const rows = await this.db(TABLE)
            .select('*')
            .orderBy('id', 'desc')
            .limit(limit)
            .offset(offset);
        return rows.map(toDomain);
    }
}
