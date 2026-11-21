const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    EmbedBuilder
} = require("discord.js");

const JOIN_ALERT_CHANNEL = "1527377790746230935";
const lineUrl = "https://i.imgur.com/SMYCROp.jpg";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "session_panel_menu") return;

        const value = interaction.values[0];

        if (value === "open_game") {
            const modal = new ModalBuilder()
                .setCustomId("open_game_modal")
                .setTitle("Open Game");

            const pilotInput = new TextInputBuilder()
                .setCustomId("pilot_id")
                .setLabel("Pilot ID")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const departureInput = new TextInputBuilder()
                .setCustomId("departure_time")
                .setLabel("Departure Time")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(pilotInput),
                new ActionRowBuilder().addComponents(departureInput)
            );

            return interaction.showModal(modal);
        }

        if (value === "join") {
            await interaction.deferReply({ flags: [64] });

            const channel = interaction.guild.channels.cache.get(JOIN_ALERT_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription(
`# **<:emoji_276:1526732130661568522> | 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 .**

-# **A new roleplay session has just been opened by the host below . If you would like to participate , please add the host and join the session as soon as possible .**

**<:BC:1408079616081399968> | Host : ( <@${interaction.user.id}> ) .**

-# **Please make sure you have added the host before requesting an invitation .**
-# **Follow all server rules and respect the session host at all times .**
-# **We wish everyone a fun and enjoyable roleplay experience .**

**<:BC:1394417506956873882> | Bright Town Management .**
-# \`#\` **For : @everyone - @here**
-# **Bright Town RP © All Rights Reserved .**`
                    );

                await channel.send({ embeds: [embed] });
                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: "<a:34:1396338093841191012> | تم ارسال التجوين بنجاح" });
        }

        if (value === "alert") {
            const modal = new ModalBuilder()
                .setCustomId("alert_modal")
                .setTitle("Important Notice");

            const noticeInput = new TextInputBuilder()
                .setCustomId("important_notice")
                .setLabel("Important Notice")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(noticeInput)
            );

            return interaction.showModal(modal);
        }
    }
};