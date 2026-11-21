const mongoose = require("mongoose");

const phoneSurveySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    mood: { type: String, required: true },
    character: { type: String, required: true },
    cityAge: { type: String, required: true },
    improve: { type: String, required: true },
    rating: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

phoneSurveySchema.index({ guildId: 1, userId: 1, createdAt: -1 });

module.exports = mongoose.model("PhoneSurvey", phoneSurveySchema);
