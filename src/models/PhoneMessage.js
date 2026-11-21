const mongoose = require("mongoose");

const phoneMessageSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    fromId: { type: String, required: true },
    toId: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

phoneMessageSchema.index({ guildId: 1, createdAt: -1 });

module.exports = mongoose.model("PhoneMessage", phoneMessageSchema);
