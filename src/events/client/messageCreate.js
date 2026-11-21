const autoLine = require("../../services/autoLine");
const { autoLineUrl } = require("../../config/ids");

module.exports = {
    name: "messageCreate",
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const prefix = client.config.prefix;
        const isCommand = Boolean(prefix) && message.content.startsWith(prefix);

        try {
            const isAutoLineChannel = await autoLine.hasChannel(message.channel.id);
            if (isAutoLineChannel && !isCommand) {
                await message.channel.send({ content: autoLineUrl });
                return;
            }
        } catch (error) {
            console.error(error);
        }

        const lineTriggers = ["خ", "خط", "-خط"];
        if (lineTriggers.includes(message.content.trim())) {
            try {
                await message.delete();
                await message.channel.send({ content: autoLineUrl });
            } catch (error) {
                console.error(error);
            }
            return;
        }

        if (!isCommand) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = (args.shift() || "").toLowerCase();
        const command = client.commands.get(commandName) ||
            client.commands.find((cmd) => cmd.aliases && cmd.aliases.some((alias) => alias.toLowerCase() === commandName));

        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(error);
        }
    }
};
