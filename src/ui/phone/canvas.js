const path = require("path");
const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const { APPS, ITEMS, STATIONS } = require("../../config/phone");

const FONT = "Tajawal";
const boldPath = path.join(__dirname, "../../assets/fonts/Tajawal-Bold.ttf");
const regularPath = path.join(__dirname, "../../assets/fonts/Tajawal-Regular.ttf");
GlobalFonts.registerFromPath(boldPath, FONT);

const W = 560;
const H = 1120;
const GOLD = "#e0b15a";
const FG = "#f6f1e7";
const MUTED = "#b3a794";
const SCREEN = "#110f0c";
const CARD = "#221c16";

function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
}

function clock() {
    return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
        timeZone: "Asia/Riyadh"
    }).format(new Date());
}

function shell(draw) {
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#070605";
    ctx.fillRect(0, 0, W, H);
    roundRect(ctx, 8, 8, W - 16, H - 16, 64);
    ctx.fillStyle = "#1a1612";
    ctx.fill();
    roundRect(ctx, 24, 24, W - 48, H - 48, 48);
    ctx.fillStyle = SCREEN;
    ctx.fill();

    ctx.fillStyle = FG;
    ctx.font = `28px ${FONT}`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(clock(), 52, 62);
    ctx.fillStyle = GOLD;
    ctx.textAlign = "right";
    ctx.fillText("BT", W - 52, 62);

    roundRect(ctx, W / 2 - 54, 48, 108, 22, 11);
    ctx.fillStyle = "#000000";
    ctx.fill();

    draw(ctx, { x: 44, y: 96, w: W - 88, h: H - 160 });

    roundRect(ctx, W / 2 - 70, H - 58, 140, 8, 4);
    ctx.fillStyle = "#3a332b";
    ctx.fill();
    return canvas.toBuffer("image/png");
}

function write(ctx, value, x, y, size, color, align, maxWidth) {
    ctx.font = `${size}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    let shown = String(value ?? "");
    if (maxWidth) {
        while (shown.length > 1 && ctx.measureText(shown).width > maxWidth) {
            shown = shown.slice(0, -1);
        }
    }
    ctx.fillText(shown, x, y);
    return shown;
}

function card(ctx, x, y, w, h) {
    roundRect(ctx, x, y, w, h, 22);
    ctx.fillStyle = CARD;
    ctx.fill();
}

function glyph(ctx, id, cx, cy, color) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (id === "chat") {
        roundRect(ctx, -22, -18, 34, 24, 8);
        ctx.stroke();
        roundRect(ctx, -8, -4, 30, 22, 8);
        ctx.stroke();
    } else if (id === "bank") {
        roundRect(ctx, -26, -16, 52, 32, 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-26, -4);
        ctx.lineTo(26, -4);
        ctx.stroke();
    } else if (id === "map") {
        ctx.beginPath();
        ctx.moveTo(0, -24);
        ctx.lineTo(16, 8);
        ctx.lineTo(0, 22);
        ctx.lineTo(-16, 8);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, -2, 5, 0, Math.PI * 2);
        ctx.stroke();
    } else if (id === "camera") {
        roundRect(ctx, -24, -14, 48, 32, 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 2, 8, 0, Math.PI * 2);
        ctx.stroke();
    } else if (id === "feed") {
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-2, -16);
        ctx.lineTo(6, 14);
        ctx.lineTo(12, 0);
        ctx.lineTo(22, 0);
        ctx.stroke();
    } else if (id === "contacts") {
        ctx.beginPath();
        ctx.arc(0, -8, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 22, 18, Math.PI, 0);
        ctx.stroke();
    } else if (id === "notes") {
        roundRect(ctx, -18, -22, 36, 44, 4);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(10, -8);
        ctx.moveTo(-8, 2);
        ctx.lineTo(10, 2);
        ctx.moveTo(-8, 12);
        ctx.lineTo(4, 12);
        ctx.stroke();
    } else if (id === "radio") {
        ctx.beginPath();
        ctx.arc(0, 4, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 4, 18, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 4, 28, Math.PI * 1.2, Math.PI * 1.8);
        ctx.stroke();
    } else if (id === "weather") {
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.stroke();
        for (let ray = 0; ray < 8; ray += 1) {
            const angle = (ray / 8) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle) * 16, Math.sin(angle) * 16);
            ctx.lineTo(Math.cos(angle) * 24, Math.sin(angle) * 24);
            ctx.stroke();
        }
    } else if (id === "store") {
        ctx.beginPath();
        ctx.moveTo(-18, -6);
        ctx.lineTo(-12, -20);
        ctx.lineTo(12, -20);
        ctx.lineTo(18, -6);
        ctx.stroke();
        roundRect(ctx, -18, -6, 36, 26, 4);
        ctx.stroke();
    } else if (id === "sos") {
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(0, 10);
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.stroke();
    } else if (id === "survey") {
        roundRect(ctx, -20, -22, 40, 44, 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(-2, -2);
        ctx.lineTo(10, -14);
        ctx.stroke();
    } else {
        roundRect(ctx, -24, -16, 48, 32, 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-10, -2, 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(16, -8);
        ctx.moveTo(0, 0);
        ctx.lineTo(16, 0);
        ctx.moveTo(0, 8);
        ctx.lineTo(10, 8);
        ctx.stroke();
    }
    ctx.restore();
}

function renderHome() {
    return shell((ctx, box) => {
        write(ctx, "برايت تاون", box.x + box.w, box.y + 28, 22, MUTED, "right", box.w);
        write(ctx, clock(), box.x + box.w, box.y + 78, 64, FG, "right", box.w);
        write(ctx, "نظام الجوال الحصري", box.x + box.w, box.y + 122, 24, GOLD, "right", box.w);

        const cols = 4;
        const size = 92;
        const gapX = 16;
        const gapY = 28;
        const gridW = cols * size + (cols - 1) * gapX;
        const startX = box.x + (box.w - gridW) / 2;
        APPS.forEach((app, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = startX + col * (size + gapX);
            const y = box.y + 170 + row * (size + 36 + gapY);
            roundRect(ctx, x, y, size, size, 24);
            ctx.fillStyle = "#1c1814";
            ctx.fill();
            ctx.strokeStyle = "#3a3127";
            ctx.lineWidth = 2;
            ctx.stroke();
            glyph(ctx, app.id, x + size / 2, y + size / 2 - 4, GOLD);
            write(ctx, app.name, x + size / 2, y + size + 16, 16, FG, "center", size + 8);
        });
    });
}

function header(ctx, box, title, subtitle) {
    write(ctx, title, box.x + box.w, box.y + 20, 36, FG, "right", box.w);
    if (subtitle) write(ctx, subtitle, box.x + box.w, box.y + 58, 20, MUTED, "right", box.w);
}

function renderBank(account) {
    return shell((ctx, box) => {
        header(ctx, box, "البنك", account.phone);
        card(ctx, box.x, box.y + 90, box.w, 150);
        write(ctx, "الرصيد", box.x + box.w - 24, box.y + 124, 20, MUTED, "right");
        write(ctx, `${account.balance} $`, box.x + box.w - 24, box.y + 176, 48, GOLD, "right", box.w - 48);
        const rows = (account.ledger || []).slice(-4).reverse();
        rows.forEach((entry, index) => {
            const y = box.y + 280 + index * 78;
            card(ctx, box.x, y, box.w, 66);
            write(ctx, entry.text || "-", box.x + box.w - 20, y + 33, 22, FG, "right", box.w - 40);
        });
        if (!rows.length) write(ctx, "ما فيه عمليات بعد", box.x + box.w, box.y + 300, 22, MUTED, "right", box.w);
    });
}

function renderChat(messages, userId) {
    return shell((ctx, box) => {
        header(ctx, box, "الرسائل", "دردشة المدينة");
        const rows = messages || [];
        if (!rows.length) {
            write(ctx, "صندوقك فاضي", box.x + box.w, box.y + 140, 28, MUTED, "right", box.w);
            return;
        }
        rows.forEach((entry, index) => {
            const mine = entry.fromId === userId;
            const y = box.y + 100 + index * 110;
            const bubbleW = box.w - 40;
            card(ctx, box.x + 20, y, bubbleW, 96);
            write(ctx, mine ? "أنت" : "وارد", box.x + bubbleW, y + 28, 16, GOLD, "right");
            write(ctx, entry.body, box.x + bubbleW, y + 62, 22, FG, "right", bubbleW - 36);
        });
    });
}

function renderMap() {
    const zones = [
        { name: "الوسط", x: 40, y: 120, w: 180, h: 150 },
        { name: "الميناء", x: 240, y: 90, w: 190, h: 130 },
        { name: "الشمال", x: 70, y: 290, w: 160, h: 140 },
        { name: "المطار", x: 250, y: 250, w: 180, h: 160 },
        { name: "الصناعية", x: 80, y: 460, w: 300, h: 120 }
    ];
    return shell((ctx, box) => {
        header(ctx, box, "الخريطة", "برايت تاون");
        ctx.save();
        ctx.translate(box.x, box.y);
        ctx.strokeStyle = "#3d3428";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(30, 200);
        ctx.lineTo(430, 200);
        ctx.moveTo(210, 80);
        ctx.lineTo(210, 620);
        ctx.stroke();
        zones.forEach((zone) => {
            roundRect(ctx, zone.x, zone.y, zone.w, zone.h, 18);
            ctx.fillStyle = "#1b1713";
            ctx.fill();
            ctx.strokeStyle = GOLD;
            ctx.lineWidth = 2;
            ctx.stroke();
            write(ctx, zone.name, zone.x + zone.w - 16, zone.y + zone.h / 2, 24, FG, "right", zone.w - 24);
        });
        ctx.restore();
    });
}

function renderCamera(name, seed) {
    return shell((ctx, box) => {
        const sky = seed % 2 === 0 ? "#1d2430" : "#2a1c18";
        roundRect(ctx, box.x, box.y, box.w, box.h - 20, 28);
        ctx.fillStyle = sky;
        ctx.fill();
        for (let i = 0; i < 8; i += 1) {
            const h = 80 + ((seed * (i + 3)) % 220);
            const bw = 40;
            const x = box.x + 16 + i * 58;
            ctx.fillStyle = i % 2 ? "#14110e" : "#0c0b09";
            ctx.fillRect(x, box.y + box.h - 40 - h, bw, h);
            ctx.fillStyle = GOLD;
            ctx.fillRect(x + 8, box.y + box.h - 70 - (h % 90), 10, 6);
        }
        write(ctx, "BRIGHT CAM", box.x + 24, box.y + 36, 22, GOLD, "left");
        write(ctx, name, box.x + box.w - 20, box.y + box.h - 70, 24, FG, "right", box.w - 40);
        write(ctx, clock(), box.x + box.w - 20, box.y + box.h - 36, 18, MUTED, "right");
    });
}

function renderFeed(posts) {
    return shell((ctx, box) => {
        header(ctx, box, "لايف انفيدر", "نبض المدينة");
        const rows = posts || [];
        if (!rows.length) {
            write(ctx, "ما فيه منشورات", box.x + box.w, box.y + 140, 26, MUTED, "right", box.w);
            return;
        }
        rows.forEach((post, index) => {
            const y = box.y + 100 + index * 120;
            card(ctx, box.x, y, box.w, 106);
            write(ctx, "منشور", box.x + box.w - 20, y + 30, 16, GOLD, "right");
            write(ctx, post.body, box.x + box.w - 20, y + 68, 22, FG, "right", box.w - 40);
        });
    });
}

function renderContacts(account) {
    return shell((ctx, box) => {
        header(ctx, box, "الجهات", `${(account.contacts || []).length} رقم`);
        const rows = account.contacts || [];
        if (!rows.length) {
            write(ctx, "أضف أول رقم", box.x + box.w, box.y + 140, 26, MUTED, "right", box.w);
            return;
        }
        rows.slice(-6).reverse().forEach((contact, index) => {
            const y = box.y + 100 + index * 100;
            card(ctx, box.x, y, box.w, 84);
            write(ctx, contact.name, box.x + box.w - 20, y + 30, 26, FG, "right", box.w - 40);
            write(ctx, contact.phone, box.x + box.w - 20, y + 60, 18, GOLD, "right", box.w - 40);
        });
    });
}

function renderNotes(account) {
    return shell((ctx, box) => {
        header(ctx, box, "الملاحظات", "خاص");
        card(ctx, box.x, box.y + 100, box.w, 420);
        const note = account.notes || "ما كتبت شيء";
        const words = note.split(" ");
        let line = "";
        let y = box.y + 150;
        words.forEach((word) => {
            const next = `${line} ${word}`.trim();
            ctx.font = `26px ${FONT}`;
            if (ctx.measureText(next).width > box.w - 56) {
                write(ctx, line, box.x + box.w - 28, y, 26, FG, "right", box.w - 56);
                line = word;
                y += 40;
            } else {
                line = next;
            }
        });
        if (line) write(ctx, line, box.x + box.w - 28, y, 26, FG, "right", box.w - 56);
    });
}

function renderRadio(stationId) {
    const station = STATIONS.find((entry) => entry.id === stationId) || STATIONS[0];
    return shell((ctx, box) => {
        header(ctx, box, "الراديو", "حصري");
        ctx.beginPath();
        ctx.arc(box.x + box.w / 2, box.y + 280, 120, 0, Math.PI * 2);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 10;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(box.x + box.w / 2, box.y + 280, 70, 0, Math.PI * 2);
        ctx.stroke();
        write(ctx, station.name, box.x + box.w / 2, box.y + 470, 42, FG, "center", box.w);
        write(ctx, station.track, box.x + box.w / 2, box.y + 520, 24, GOLD, "center", box.w);
    });
}

function renderWeather() {
    const day = new Date().getDate();
    const modes = [
        { name: "صافي", temp: 34 },
        { name: "غائم", temp: 29 },
        { name: "حار", temp: 41 },
        { name: "مغبر", temp: 37 },
        { name: "ليل هادئ", temp: 24 }
    ];
    const mode = modes[day % modes.length];
    return shell((ctx, box) => {
        header(ctx, box, "الطقس", "برايت تاون");
        write(ctx, `${mode.temp}°`, box.x + box.w, box.y + 180, 92, FG, "right", box.w);
        write(ctx, mode.name, box.x + box.w, box.y + 260, 36, GOLD, "right", box.w);
        card(ctx, box.x, box.y + 340, box.w, 120);
        write(ctx, "الرطوبة منخفضة والرؤية واضحة وسط المدينة", box.x + box.w - 20, box.y + 400, 22, FG, "right", box.w - 40);
    });
}

function renderStore(account) {
    return shell((ctx, box) => {
        header(ctx, box, "المتجر", `${account.balance} $`);
        ITEMS.forEach((item, index) => {
            const y = box.y + 96 + index * 112;
            card(ctx, box.x, y, box.w, 98);
            const owned = (account.owned || []).includes(item.id);
            write(ctx, item.name, box.x + box.w - 20, y + 34, 26, FG, "right", box.w - 40);
            write(ctx, owned ? "مملوك" : `${item.price} $`, box.x + box.w - 20, y + 68, 20, GOLD, "right");
        });
    });
}

function renderSos() {
    return shell((ctx, box) => {
        header(ctx, box, "الطوارئ", "بلاغ سريع");
        ctx.beginPath();
        ctx.arc(box.x + box.w / 2, box.y + 280, 90, 0, Math.PI * 2);
        ctx.strokeStyle = "#d4544a";
        ctx.lineWidth = 10;
        ctx.stroke();
        write(ctx, "SOS", box.x + box.w / 2, box.y + 280, 48, "#d4544a", "center");
        write(ctx, "اكتب البلاغ وبنوصله", box.x + box.w / 2, box.y + 430, 26, FG, "center", box.w);
    });
}

function renderSurvey(survey) {
    return shell((ctx, box) => {
        header(ctx, box, "الاستبيان", "حرف مطول");
        const lines = survey
            ? [
                `كيف حالك: ${survey.mood}`,
                `الشخصية: ${survey.character}`,
                `العمر: ${survey.cityAge}`,
                `التقييم: ${survey.rating}`
            ]
            : ["الو كيف حالك", "عب الاستبيان من الزر"];
        lines.forEach((line, index) => {
            const y = box.y + 120 + index * 110;
            card(ctx, box.x, y, box.w, 92);
            write(ctx, line, box.x + box.w - 20, y + 46, 24, FG, "right", box.w - 40);
        });
    });
}

function renderId(account, name) {
    return shell((ctx, box) => {
        header(ctx, box, "الهوية", "Bright Town");
        card(ctx, box.x, box.y + 120, box.w, 280);
        ctx.fillStyle = GOLD;
        ctx.fillRect(box.x, box.y + 120, 12, 280);
        write(ctx, name, box.x + box.w - 28, box.y + 180, 32, FG, "right", box.w - 70);
        write(ctx, account.phone, box.x + box.w - 28, box.y + 240, 28, GOLD, "right", box.w - 70);
        write(ctx, `رصيد ${account.balance}`, box.x + box.w - 28, box.y + 300, 24, MUTED, "right", box.w - 70);
        write(ctx, "بطاقة رقمية حصرية", box.x + box.w - 28, box.y + 450, 22, MUTED, "right", box.w);
    });
}

function render(app, data = {}) {
    if (app === "bank") return renderBank(data.account);
    if (app === "chat") return renderChat(data.messages, data.userId);
    if (app === "map") return renderMap();
    if (app === "camera") return renderCamera(data.name || "Bright", data.seed || 1);
    if (app === "feed") return renderFeed(data.posts);
    if (app === "contacts") return renderContacts(data.account);
    if (app === "notes") return renderNotes(data.account);
    if (app === "radio") return renderRadio(data.station);
    if (app === "weather") return renderWeather();
    if (app === "store") return renderStore(data.account);
    if (app === "sos") return renderSos();
    if (app === "survey") return renderSurvey(data.survey);
    if (app === "id") return renderId(data.account, data.name || "Player");
    return renderHome();
}

module.exports = { render, FONT_READY: regularPath };
