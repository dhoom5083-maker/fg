const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "admin_points_panel") return;

        const menu = new StringSelectMenuBuilder()
            .setCustomId("points_menu")
            .setPlaceholder("Choose an option ..")
            .setMaxValues(1)
            .addOptions([
                { label: "Top 10", value: "top10" },
                { label: "Points", value: "points" },
                { label: "Request points", value: "request_points" }
            ]);

        const row = new ActionRowBuilder().addComponents(menu);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text => text.setContent('# 𝗣𝗼𝗶𝗻𝘁𝘀 𝗠𝗮𝗻𝗮𝗴𝗲𝗺𝗲𝗻𝘁 𝗣𝗮𝗻𝗲𝗹'))
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(text => text.setContent(
`**Welcome to the Administrative Points Management Panel . This panel is designed exclusively for authorized staff members to manage the server's points system in a secure , organized , and professional manner . Through this panel , administrators can add , remove , edit , or review members' points while maintaining complete accuracy and fairness .

Please ensure that every points adjustment is based on valid reasons and follows the server's regulations and internal administrative policies . All point transactions are recorded for transparency and may be reviewed by senior management whenever necessary .

Thank you for helping us maintain a fair and reliable points system for everyone in Bright Town .**`
            ))
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addActionRowComponents(row)
            .setAccentColor(0x2f3136);

        return interaction.reply({
            flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
            components: [container],
        });
    }
};