const mongoose = require('mongoose');

const autoLineChannelSchema = new mongoose.Schema({
    channelId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('AutoLineChannel', autoLineChannelSchema);
