const Attendance = require('../models/Attendance');

module.exports = {
    setPanelMessage: async (guildId, channelId, messageId) => {
        await Attendance.findOneAndUpdate(
            { guildId },
            { guildId, panelChannel: channelId, panelMessage: messageId },
            { upsert: true, new: true }
        );
    },
    getData: async (guildId) => {
        const doc = await Attendance.findOne({ guildId });
        if (!doc) return null;
        return {
            panelChannel: doc.panelChannel,
            panelMessage: doc.panelMessage,
            loggedIn: doc.loggedIn
        };
    },
    logIn: async (guildId, userId) => {
        const doc = await Attendance.findOneAndUpdate(
            { guildId },
            { $addToSet: { loggedIn: userId } },
            { upsert: true, new: true }
        );
        return doc.loggedIn;
    },
    logOut: async (guildId, userId) => {
        const doc = await Attendance.findOneAndUpdate(
            { guildId },
            { $pull: { loggedIn: userId } },
            { upsert: true, new: true }
        );
        return doc.loggedIn;
    }
};