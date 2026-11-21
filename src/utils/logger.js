function write(level, scope, message) {
    const time = new Date().toISOString();
    const line = `[${time}] ${level} ${scope} ${message}`;
    if (level === "error") console.error(line);
    else console.log(line);
}

module.exports = {
    info(scope, message) {
        write("info", scope, message);
    },
    error(scope, message) {
        write("error", scope, message);
    }
};
