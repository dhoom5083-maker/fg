const mongoose = require('mongoose');

const guildStatusSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    serverStatusMsg: {
        channel: { type: String, default: null },
        message: { type: String, default: null }
    }
});

module.exports = mongoose.model('GuildStatus', guildStatusSchema);
