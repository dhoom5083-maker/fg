const mongoose = require("mongoose");

const phonePostSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    body: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

phonePostSchema.index({ guildId: 1, createdAt: -1 });

module.exports = mongoose.model("PhonePost", phonePostSchema);
