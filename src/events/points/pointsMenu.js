const {
    EmbedBuilder,
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");
const pointsDB = require("../../services/pointsManager");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "points_menu") return;

        const value = interaction.values[0];

        if (value === "top10") {
            const data = await pointsDB.getAllPoints();
            const sorted = Object.entries(data)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10);

            const list = sorted.length > 0
                ? sorted.map(([userId]) => `<@${userId}>`).join("\n")
                : "-";

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("Top 10")
                .setDescription(`**\nAdmin   :\n${list}\n**`);

            return interaction.reply({ embeds: [embed], flags: [64] });
        }

        if (value === "points") {
            const total = await pointsDB.getPoints(interaction.user.id);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# **<:BC:1408079616081399968> | 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗔𝗱𝗺𝗶𝗻 𝗣𝗼𝗶𝗻𝘁𝘀 .**'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`-# **The following information displays the current administrative points and performance record of the selected staff member .**

**<:emoji_259:1420427109842550935> | 𝗔𝗱𝗺𝗶𝗻 : ( <@${interaction.user.id}> ) .**

**<:emoji_252:1406543762393530429> | Total Points : ( \`${total}\` ) .**

**<:emoji_236:1395599624898609212> | Administrative Notes :**
-# **( 1 ) — Administrative points are earned through activity , responsibility , and completing assigned tasks .**
-# **( 2 ) — Points may increase or decrease depending on administrative performance .**
-# **( 3 ) — All records are reviewed and managed by the server administration .**`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent('-# **Bright Town Management © All Rights Reserved .**'))
                .setAccentColor(0x2f3136);

            return interaction.reply({
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                components: [container],
            });
        }

        if (value === "request_points") {
            const modal = new ModalBuilder()
                .setCustomId("points_request_modal")
                .setTitle("Request Points");

            const amountInput = new TextInputBuilder()
                .setCustomId("points_amount")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const amountLabel = new LabelBuilder()
                .setLabel("عـدد الـنـقـاط  :")
                .setTextInputComponent(amountInput);

            const taskInput = new TextInputBuilder()
                .setCustomId("request_task")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const taskLabel = new LabelBuilder()
                .setLabel("سـبـب الـطـلـب  :")
                .setTextInputComponent(taskInput);

            const reasonSelect = new StringSelectMenuBuilder()
                .setCustomId("request_reason")
                .setPlaceholder("اختر السبب")
                .setRequired(true)
                .addOptions(
                    new StringSelectMenuOptionBuilder().setLabel("انـجـاز مـهـمـة").setValue("انجاز مهمة"),
                    new StringSelectMenuOptionBuilder().setLabel("سـبـب اخـرى").setValue("سبب اخرى")
                );

            const reasonLabel = new LabelBuilder()
                .setLabel("سـبـب طـلـب الـنـقـاط  :")
                .setStringSelectMenuComponent(reasonSelect);

            modal.addLabelComponents(amountLabel, taskLabel, reasonLabel);

            return interaction.showModal(modal);
        }
    }
};