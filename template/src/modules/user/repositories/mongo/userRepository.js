'use strict';

import { UserRepository } from '../userRepository.js';
import UserModel from '../../models/mongo/userModel.js';

// Normalize a Mongoose document into a plain domain object.
const toDomain = (doc) => doc && ({
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
});

export class MongoUserRepository extends UserRepository {
    async create(data) {
        const doc = await UserModel.create({ name: data.name, email: data.email.toLowerCase() });
        return toDomain(doc);
    }

    async findById(id) {
        const doc = await UserModel.findById(id).lean();
        return toDomain(doc);
    }

    async findByEmail(email) {
        const doc = await UserModel.findOne({ email: email.toLowerCase() }).lean();
        return toDomain(doc);
    }

    async list({ limit = 20, offset = 0 } = {}) {
        const docs = await UserModel.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();
        return docs.map(toDomain);
    }
}
