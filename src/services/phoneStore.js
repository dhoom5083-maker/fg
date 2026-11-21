const PhoneAccount = require("../models/PhoneAccount");
const PhoneMessage = require("../models/PhoneMessage");
const PhonePost = require("../models/PhonePost");
const PhoneSurvey = require("../models/PhoneSurvey");
const { ITEMS, DAILY_AMOUNT } = require("../config/phone");

function makePhone(userId) {
    return `05${String(userId).slice(-8)}`;
}

function clip(text, max) {
    return String(text || "").trim().slice(0, max);
}

async function getAccount(userId, guildId) {
    let account = await PhoneAccount.findOne({ userId, guildId });
    if (account) return account;
    account = await PhoneAccount.create({
        userId,
        guildId,
        phone: makePhone(userId)
    });
    return account;
}

async function findByQuery(guildId, query) {
    const value = String(query || "").trim().replace(/[<@!>]/g, "");
    if (!value) return null;
    return PhoneAccount.findOne({
        guildId,
        $or: [{ userId: value }, { phone: value }]
    });
}

function pushLedger(account, text) {
    account.ledger.push({ text: clip(text, 80), at: new Date() });
    if (account.ledger.length > 8) {
        account.ledger = account.ledger.slice(-8);
    }
}

async function transfer(userId, guildId, query, amount) {
    const value = Math.floor(Number(amount));
    if (!value || value < 1 || value > 1000000) return { ok: false, reason: "المبلغ غلط" };
    const target = await findByQuery(guildId, query);
    if (!target) return { ok: false, reason: "الرقم ما سجل بالجوال" };
    if (target.userId === userId) return { ok: false, reason: "ما تقدر تحول لنفسك" };

    const from = await PhoneAccount.findOneAndUpdate(
        { userId, guildId, balance: { $gte: value } },
        { $inc: { balance: -value } },
        { new: true }
    );
    if (!from) return { ok: false, reason: "رصيدك ما يكفي" };

    target.balance += value;
    pushLedger(target, `استلام ${value}`);
    await target.save();

    pushLedger(from, `تحويل ${value}`);
    await from.save();
    return { ok: true, account: from };
}

async function daily(userId, guildId) {
    const account = await getAccount(userId, guildId);
    const day = 24 * 60 * 60 * 1000;
    if (account.lastDaily && Date.now() - account.lastDaily.getTime() < day) {
        return { ok: false, reason: "المكافأة انأخذت اليوم", account };
    }
    account.balance += DAILY_AMOUNT;
    account.lastDaily = new Date();
    pushLedger(account, `مكافأة ${DAILY_AMOUNT}`);
    await account.save();
    return { ok: true, account };
}

async function sendMessage(userId, guildId, query, body) {
    const text = clip(body, 280);
    if (!text) return { ok: false, reason: "الرسالة فاضية" };
    const target = await findByQuery(guildId, query);
    if (!target) return { ok: false, reason: "الرقم ما سجل بالجوال" };
    if (target.userId === userId) return { ok: false, reason: "اختر رقم غير رقمك" };
    await PhoneMessage.create({ guildId, fromId: userId, toId: target.userId, body: text });
    return { ok: true };
}

async function recentMessages(userId, guildId) {
    return PhoneMessage.find({
        guildId,
        $or: [{ fromId: userId }, { toId: userId }]
    }).sort({ createdAt: -1 }).limit(6).lean();
}

async function publish(userId, guildId, body) {
    const text = clip(body, 280);
    if (!text) return { ok: false, reason: "المنشور فاضي" };
    await PhonePost.create({ guildId, userId, body: text });
    return { ok: true };
}

async function recentPosts(guildId) {
    return PhonePost.find({ guildId }).sort({ createdAt: -1 }).limit(6).lean();
}

async function saveNote(userId, guildId, body) {
    const account = await getAccount(userId, guildId);
    account.notes = clip(body, 300);
    await account.save();
    return account;
}

async function addContact(userId, guildId, name, phone) {
    const account = await getAccount(userId, guildId);
    const contactName = clip(name, 32);
    const contactPhone = clip(phone, 20);
    if (!contactName || !contactPhone) return { ok: false, reason: "عب الاسم والرقم", account };
    account.contacts.push({ name: contactName, phone: contactPhone });
    if (account.contacts.length > 8) account.contacts = account.contacts.slice(-8);
    await account.save();
    return { ok: true, account };
}

async function saveSurvey(userId, guildId, answers) {
    const doc = await PhoneSurvey.create({
        guildId,
        userId,
        mood: clip(answers.mood, 80),
        character: clip(answers.character, 40),
        cityAge: clip(answers.cityAge, 40),
        improve: clip(answers.improve, 300),
        rating: clip(answers.rating, 20)
    });
    return doc;
}

async function latestSurvey(userId, guildId) {
    return PhoneSurvey.findOne({ userId, guildId }).sort({ createdAt: -1 }).lean();
}

async function buy(userId, guildId, itemId) {
    const item = ITEMS.find((entry) => entry.id === itemId);
    if (!item) return { ok: false, reason: "الغرض مو موجود" };
    const account = await getAccount(userId, guildId);
    if (account.owned.includes(item.id)) return { ok: false, reason: "عندك الغرض من قبل", account };
    if (account.balance < item.price) return { ok: false, reason: "رصيدك ما يكفي", account };
    account.balance -= item.price;
    account.owned.push(item.id);
    pushLedger(account, `شراء ${item.name}`);
    await account.save();
    return { ok: true, account, item };
}

async function setRadio(userId, guildId, stationId) {
    const account = await getAccount(userId, guildId);
    account.radio = stationId;
    await account.save();
    return account;
}

async function snap(userId, guildId) {
    const account = await getAccount(userId, guildId);
    account.shots += 1;
    await account.save();
    return account;
}

module.exports = {
    getAccount,
    transfer,
    daily,
    sendMessage,
    recentMessages,
    publish,
    recentPosts,
    saveNote,
    addContact,
    saveSurvey,
    latestSurvey,
    buy,
    setRadio,
    snap
};
