const attendanceManager = require("../../services/attendanceManager");
const { buildSupervisionPanel } = require("../../ui/supervisionPanel");

const ADMIN_STREET_ROLE = "1527377019149619211";
const lineUrl = "https://cdn.discordapp.com/attachments/1525871801584848967/1527400202187702362/Picsart_26-07-16_14-15-09-567.jpg?ex=6a6b0089&is=6a69af09&hm=7124149a00f8b73380391f2ed11b3b155aaa94226911c81df22bc1cae694906e&";

module.exports = {
    name: "p13",
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            await message.channel.send({ content: lineUrl });

            const sentMessage = await message.channel.send(buildSupervisionPanel([]));

            await attendanceManager.setPanelMessage(message.guild.id, message.channel.id, sentMessage.id);

        } catch (error) {
            console.error(error);
        }
    }
};