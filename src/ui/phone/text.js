const NON_JOINING = new Set("اأإآدذرزوؤءةى".split(""));

function isArabic(char) {
    return /[\u0600-\u06FF]/.test(char);
}

function stretch(text) {
    const chars = Array.from(String(text));
    let out = "";
    for (let i = 0; i < chars.length; i += 1) {
        const current = chars[i];
        const next = chars[i + 1];
        out += current;
        if (next && isArabic(current) && isArabic(next) && !NON_JOINING.has(current)) {
            out += "ـ";
        }
    }
    return out;
}

function fit(text, max) {
    const value = stretch(text);
    if (value.length <= max) return value;
    return value.slice(0, max);
}

module.exports = { stretch, fit };
