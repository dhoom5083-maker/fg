const GuildStatus = require('../models/GuildStatus');

module.exports = {
    findOne: async ({ guild }) => {
        const doc = await GuildStatus.findOne({ guildId: guild });
        if (!doc) return null;
        return {
            serverStatusMsg: doc.serverStatusMsg
        };
    },
    setServerStatusMsg: async (guildId, channelId, messageId) => {
        const doc = await GuildStatus.findOneAndUpdate(
            { guildId },
            { guildId, serverStatusMsg: { channel: channelId, message: messageId } },
            { upsert: true, new: true }
        );
        return { serverStatusMsg: doc.serverStatusMsg };
    },
    save: async (guildId, updatedData) => {
        const doc = await GuildStatus.findOneAndUpdate(
            { guildId },
            { guildId, ...updatedData },
            { upsert: true, new: true }
        );
        return { serverStatusMsg: doc.serverStatusMsg };
    }
};
