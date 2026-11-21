const mongoose = require('mongoose');

const ticketPointsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

module.exports = mongoose.model('TicketPoints', ticketPointsSchema);
