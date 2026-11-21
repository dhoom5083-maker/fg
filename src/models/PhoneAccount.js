const mongoose = require("mongoose");

const phoneAccountSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    phone: { type: String, required: true },
    balance: { type: Number, default: 5000 },
    notes: { type: String, default: "" },
    contacts: {
        type: [{ name: String, phone: String }],
        default: []
    },
    owned: { type: [String], default: [] },
    lastDaily: { type: Date, default: null },
    radio: { type: String, default: "bright" },
    shots: { type: Number, default: 0 },
    ledger: {
        type: [{ text: String, at: Date }],
        default: []
    }
});

phoneAccountSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model("PhoneAccount", phoneAccountSchema);
