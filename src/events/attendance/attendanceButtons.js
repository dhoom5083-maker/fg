const attendanceManager = require("../../services/attendanceManager");
const { buildSupervisionPanel } = require("../../ui/supervisionPanel");

const MAX_LOGGED_IN = 2;

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;
        if (!["attendance_login", "attendance_logout"].includes(interaction.customId)) return;

        if (!interaction.member.roles.cache.has("1527377091044053103")) {
            return interaction.reply({ content: "ما عندك رتبه يامعلم", flags: [64] });
        }

        try {
            await interaction.deferReply({ flags: [64] });

            const data = await attendanceManager.getData(interaction.guild.id);
            if (!data || !data.panelChannel || !data.panelMessage) {
                return interaction.editReply({ content: "راجع المبرمجين" });
            }

            const panelChannel = interaction.guild.channels.cache.get(data.panelChannel);
            if (!panelChannel) return interaction.editReply({ content: "راجع المبرمجين" });

            const panelMessage = await panelChannel.messages.fetch(data.panelMessage).catch(() => null);
            if (!panelMessage) return interaction.editReply({ content: "راجع المبرمجين" });

            if (interaction.customId === "attendance_login") {
                if (data.loggedIn.includes(interaction.user.id)) {
                    return interaction.editReply({ content: "<:BT:1394997423335800883> | أنت مسجل دخول بالفعل" });
                }

                if (data.loggedIn.length >= MAX_LOGGED_IN) {
                    return interaction.editReply({ content: "<:BT:1394997423335800883> | تم الوصول للحد الأقصى من عدد المسجلين دخول" });
                }

                const updatedList = await attendanceManager.logIn(interaction.guild.id, interaction.user.id);

                await panelMessage.edit(buildSupervisionPanel(updatedList));

                return interaction.editReply({ content: "<:BT:1394416095254941747> | تم تسجيل دخولك بنجاح" });
            }

            if (interaction.customId === "attendance_logout") {
                if (!data.loggedIn.includes(interaction.user.id)) {
                    return interaction.editReply({ content: "<:BT:1394997423335800883> | سجل دخولك بعدين سجل خروجك" });
                }

                const updatedList = await attendanceManager.logOut(interaction.guild.id, interaction.user.id);

                await panelMessage.edit(buildSupervisionPanel(updatedList));

                return interaction.editReply({ content: "<:BT:1394416095254941747> | تم تسجيل خروجك بنجاح" });
            }

        } catch (error) {
            console.error("Error in attendance buttons handler:", error);
            if (interaction.deferred || interaction.replied) {
                interaction.editReply({ content: "راجع المبرمجين" }).catch(() => null);
            } else {
                interaction.reply({ content: "راجع المبرمجين", flags: [64] }).catch(() => null);
            }
        }
    }
};