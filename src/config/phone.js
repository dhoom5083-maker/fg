const APPS = [
    { id: "chat", name: "الرسائل", hint: "دردشة خاصة بين اللاعبين" },
    { id: "bank", name: "البنك", hint: "رصيد وتحويل ومكافأة يومية" },
    { id: "map", name: "الخريطة", hint: "أحياء برايت تاون" },
    { id: "camera", name: "الكاميرا", hint: "لقطة حصرية بوقت المدينة" },
    { id: "feed", name: "لايف انفيدر", hint: "منشورات المدينة" },
    { id: "contacts", name: "الجهات", hint: "احفظ أرقام الجوال" },
    { id: "notes", name: "الملاحظات", hint: "ملاحظة خاصة على جوالك" },
    { id: "radio", name: "الراديو", hint: "محطات حصرية" },
    { id: "weather", name: "الطقس", hint: "جو المدينة اليوم" },
    { id: "store", name: "المتجر", hint: "أغراض حصرية بالجوال" },
    { id: "sos", name: "الطوارئ", hint: "بلاغ سريع للإدارة" },
    { id: "survey", name: "الاستبيان", hint: "أسئلة بحرف مطول" },
    { id: "id", name: "الهوية", hint: "بطاقتك الرقمية" }
];

const ITEMS = [
    { id: "gold_sim", name: "شريحة ذهب", price: 2500 },
    { id: "garage", name: "مفتاح كراج", price: 8000 },
    { id: "pro_cam", name: "كاميرا برو", price: 4500 },
    { id: "vip_radio", name: "راديو حصري", price: 3000 },
    { id: "night", name: "نظارة ليل", price: 6000 }
];

const STATIONS = [
    { id: "bright", name: "برايت", track: "أضواء الوسط" },
    { id: "night", name: "الليل", track: "درب الميناء" },
    { id: "rap", name: "راب", track: "صوت الصناعية" },
    { id: "calm", name: "هادئ", track: "سطح المطار" }
];

const DAILY_AMOUNT = 750;

module.exports = { APPS, ITEMS, STATIONS, DAILY_AMOUNT };
