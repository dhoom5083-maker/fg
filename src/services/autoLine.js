const AutoLineChannel = require('../models/AutoLineChannel');

module.exports = {
    addChannel: async (channelId) => {
        await AutoLineChannel.findOneAndUpdate(
            { channelId },
            { channelId },
            { upsert: true, new: true }
        );
    },
    removeChannel: async (channelId) => {
        await AutoLineChannel.deleteOne({ channelId });
    },
    hasChannel: async (channelId) => {
        const doc = await AutoLineChannel.findOne({ channelId });
        return !!doc;
    },
    getAllChannels: async () => {
        const docs = await AutoLineChannel.find({});
        return docs.map(d => d.channelId);
    }
};
