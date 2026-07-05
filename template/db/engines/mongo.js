'use strict';

import mongoose from 'mongoose';

mongoose.set('allowDiskUse', true);

function buildUri() {
    const portString = !process.env.MONGO_PORT ? '' : `:${process.env.MONGO_PORT}`;

    let uri = `${process.env.MONGO_PROTOCOL}://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@${process.env.MONGO_SERVER}${portString}/${process.env.MONGO_DB}`;

    const params = [];
    if (process.env.MONGO_AUTH_SOURCE) params.push(`authSource=${process.env.MONGO_AUTH_SOURCE}`);
    if (process.env.MONGO_RETRY_WRITES) params.push(`retryWrites=${process.env.MONGO_RETRY_WRITES}`);
    if (process.env.MONGO_W) params.push(`w=${process.env.MONGO_W}`);
    if (process.env.MONGO_APP_NAME) params.push(`appName=${process.env.MONGO_APP_NAME}`);

    if (params.length > 0) uri += '?' + params.join('&');

    return uri;
}

export async function connect() {
    const uri = buildUri();
    await mongoose.connect(uri, {});
    mongoose.connection.setMaxListeners(20);
    console.log('\x1b[32m✅ [DB] MongoDB connected\x1b[0m');
    return mongoose.connection;
}

export async function disconnect(connection) {
    await connection.close();
}
