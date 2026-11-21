const Points = require('../models/Points');

module.exports = {
    addPoint: async (userId) => {
        const doc = await Points.findOneAndUpdate(
            { userId },
            { $inc: { points: 1 } },
            { upsert: true, new: true }
        );
        return doc.points;
    },
    getPoints: async (userId) => {
        const doc = await Points.findOne({ userId });
        return doc ? doc.points : 0;
    },
    getAllPoints: async () => {
        const docs = await Points.find({});
        const result = {};
        for (const doc of docs) {
            result[doc.userId] = doc.points;
        }
        return result;
    },
    addPoints: async (userId, amount) => {
        const doc = await Points.findOneAndUpdate(
            { userId },
            { $inc: { points: amount } },
            { upsert: true, new: true }
        );
        return doc.points;
    },
    removePoints: async (userId, amount) => {
        let doc = await Points.findOne({ userId });
        if (!doc) doc = await Points.create({ userId, points: 0 });

        let newPoints = doc.points - amount;
        if (newPoints < 0) newPoints = 0;

        doc.points = newPoints;
        await doc.save();
        return doc.points;
    }
};
