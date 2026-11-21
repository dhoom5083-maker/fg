const Ticket = require('../models/Ticket');
const TicketCounter = require('../models/TicketCounter');
const TicketPoints = require('../models/TicketPoints');

module.exports = {
    nextTicketNumber: async () => {
        const counter = await TicketCounter.findOneAndUpdate(
            { key: 'global' },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
        return counter.count;
    },
    setTicket: async (channelId, info) => {
        await Ticket.findOneAndUpdate(
            { channelId },
            { channelId, ...info },
            { upsert: true, new: true }
        );
    },
    getTicket: async (channelId) => {
        const doc = await Ticket.findOne({ channelId });
        if (!doc) return null;
        return {
            opener: doc.opener,
            type: doc.type,
            claimedBy: doc.claimedBy
        };
    },
    updateTicket: async (channelId, updates) => {
        const doc = await Ticket.findOneAndUpdate(
            { channelId },
            { $set: updates },
            { new: true }
        );
        if (!doc) return null;
        return {
            opener: doc.opener,
            type: doc.type,
            claimedBy: doc.claimedBy
        };
    },
    deleteTicket: async (channelId) => {
        await Ticket.deleteOne({ channelId });
    },
    addPoint: async (userId) => {
        const doc = await TicketPoints.findOneAndUpdate(
            { userId },
            { $inc: { points: 1 } },
            { upsert: true, new: true }
        );
        return doc.points;
    },
    removePoint: async (userId) => {
        let doc = await TicketPoints.findOne({ userId });
        if (!doc) doc = await TicketPoints.create({ userId, points: 0 });

        let newPoints = doc.points - 1;
        if (newPoints < 0) newPoints = 0;

        doc.points = newPoints;
        await doc.save();
        return doc.points;
    },
    getPoints: async (userId) => {
        const doc = await TicketPoints.findOne({ userId });
        return doc ? doc.points : 0;
    }
};
