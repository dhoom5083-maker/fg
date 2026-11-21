const { PermissionFlagsBits } = require("discord.js");
const { render } = require("../../ui/phone/canvas");
const { homePayload } = require("../../ui/phone/panel");

const lineUrl = "https://imgur.com/SMYCROp";

module.exports = {
    name: "p14",
    aliases: ["جوال", "phone"],
    async execute(message) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            const png = render("home");
            await message.channel.send({ content: lineUrl });
            await message.channel.send(homePayload(png));
            await message.channel.send({ content: lineUrl });
        } catch (error) {
            console.error(error);
        }
    }
};
