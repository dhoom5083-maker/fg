const mongoose = require('mongoose');

async function connectMongo() {
    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('[MongoDB] MONGO_URI is not set in the environment variables.');
        process.exit(1);
    }

    try {
        await mongoose.connect(uri);
        console.log('[mongo] connected');
        await cleanupStaleIndexes();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

async function cleanupStaleIndexes() {
    try {
        const collection = mongoose.connection.collection('tickets');
        const indexes = await collection.indexes();

        for (const index of indexes) {
            const isKnownField = index.key && (index.key.channelId !== undefined);
            if (index.name !== '_id_' && !isKnownField) {
                await collection.dropIndex(index.name).catch(() => null);
                console.log(`[MongoDB] Dropped stale index: ${index.name}`);
            }
        }
    } catch (error) {
    }
}

module.exports = { connectMongo };