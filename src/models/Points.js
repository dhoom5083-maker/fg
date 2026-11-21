const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    points: { type: Number, default: 0 }
});

module.exports = mongoose.model('Points', pointsSchema);
