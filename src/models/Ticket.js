const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    channelId: { type: String, required: true, unique: true },
    opener: { type: String, required: true },
    type: { type: String, required: true },
    claimedBy: { type: String, default: null }
});

module.exports = mongoose.model('Ticket', ticketSchema);
