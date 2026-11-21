const fs = require("fs");
const path = require("path");
const log = require("../utils/logger");

function getFiles(dir) {
    const files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) files.push(...getFiles(full));
        else if (item.name.endsWith(".js")) files.push(full);
    }
    return files;
}

module.exports = (client) => {
    const root = path.join(__dirname, "../events");
    let count = 0;

    for (const file of getFiles(root)) {
        let event;
        try {
            event = require(file);
        } catch (error) {
            log.error("events", `failed to load ${path.relative(root, file)}: ${error.message}`);
            continue;
        }

        if (!event.name || typeof event.execute !== "function") {
            log.error("events", `missing name or execute in ${path.relative(root, file)}`);
            continue;
        }

        const runner = (...args) => event.execute(...args, client);
        if (event.once) client.once(event.name, runner);
        else client.on(event.name, runner);
        count += 1;
    }

    log.info("events", `${count} listeners`);
};
