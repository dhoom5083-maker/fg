const mongoose = require('mongoose');

const ticketCounterSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, default: 'global' },
    count: { type: Number, default: 0 }
});

module.exports = mongoose.model('TicketCounter', ticketCounterSchema);
