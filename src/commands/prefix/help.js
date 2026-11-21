const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const catalog = require("../../config/catalog");

const ORDER = ["لوحات", "حضور", "إدارة", "أدوات"];

module.exports = {
    name: "help",
    aliases: ["مساعدة", "commands"],
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        const known = new Map(catalog.map((item) => [item.name, item]));
        const groups = new Map(ORDER.map((name) => [name, []]));

        for (const command of client.commands.values()) {
            const meta = known.get(command.name) || { name: command.name, category: "أدوات", about: "أمر" };
            const bucket = groups.get(meta.category) || groups.get("أدوات");
            const aliases = (command.aliases || []).filter(Boolean);
            const aliasText = aliases.length ? ` (${aliases.join("، ")})` : "";
            const usage = meta.usage ? `\n\`${meta.usage}\`` : "";
            bucket.push(`\`-${command.name}\`${aliasText} — ${meta.about}${usage}`);
        }

        const lines = [];
        for (const category of ORDER) {
            const rows = groups.get(category);
            if (!rows.length) continue;
            lines.push(`**${category}**\n${rows.join("\n")}`);
        }

        const slash = [...client.slashCommands.values()].map((command) => `\`/${command.data.name}\` — ${command.data.description}`);
        if (slash.length) lines.push(`**سلاش**\n${slash.join("\n")}`);

        const embed = new EmbedBuilder()
            .setColor(0x2f3136)
            .setTitle("BTRP ™")
            .setDescription(lines.join("\n\n").slice(0, 4000));

        await message.channel.send({ embeds: [embed] });
    }
};
