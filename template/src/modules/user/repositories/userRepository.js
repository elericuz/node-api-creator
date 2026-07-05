'use strict';

/**
 * UserRepository — the PORT (domain contract).
 *
 * Business code (services) depends on THIS interface, never on a concrete
 * engine. The methods speak the domain's language (findByEmail, create...),
 * NOT query syntax. That is exactly what keeps swapping engines painless:
 * a leaky method like `find(query)` with a Mongo/SQL query object would drag
 * the engine back into the service and defeat the whole pattern.
 *
 * Every method returns a plain domain object: { id, name, email, createdAt }
 * (or null / an array), never a Mongoose document or a raw SQL row.
 */
export class UserRepository {
    async create(data) { throw new Error('UserRepository.create() not implemented'); }
    async findById(id) { throw new Error('UserRepository.findById() not implemented'); }
    async findByEmail(email) { throw new Error('UserRepository.findByEmail() not implemented'); }
    async list({ limit, offset } = {}) { throw new Error('UserRepository.list() not implemented'); }
}
