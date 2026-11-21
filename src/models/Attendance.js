const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    panelChannel: { type: String, default: null },
    panelMessage: { type: String, default: null },
    loggedIn: { type: [String], default: [] }
});

module.exports = mongoose.model('Attendance', attendanceSchema);