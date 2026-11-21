const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
const log = require("../utils/logger");

function getFiles(dir) {
    if (!fs.existsSync(dir)) return [];
    const files = [];
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, item.name);
        if (item.isDirectory()) files.push(...getFiles(full));
        else if (item.name.endsWith(".js")) files.push(full);
    }
    return files;
}

module.exports = (client) => {
    const slashCommands = [];
    const root = path.join(__dirname, "../commands");

    for (const file of getFiles(root)) {
        let command;
        try {
            command = require(file);
        } catch (error) {
            log.error("commands", `failed to load ${path.relative(root, file)}: ${error.message}`);
            continue;
        }

        if (command.data) {
            client.slashCommands.set(command.data.name, command);
            slashCommands.push(command.data.toJSON());
        } else if (command.name) {
            client.commands.set(command.name, command);
        } else {
            log.error("commands", `missing name in ${path.relative(root, file)}`);
        }
    }

    log.info("commands", `${client.commands.size} prefix, ${slashCommands.length} slash`);

    const rest = new REST({ version: "10" }).setToken(client.config.token);
    client.once("ready", async () => {
        try {
            await rest.put(Routes.applicationCommands(client.user.id), { body: slashCommands });
            log.info("commands", `registered ${slashCommands.length} slash commands`);
        } catch (error) {
            log.error("commands", error.message);
        }
    });
};
