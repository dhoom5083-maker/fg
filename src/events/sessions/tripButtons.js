const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;

        if (interaction.customId === "trip_session") {
            const menu = new StringSelectMenuBuilder()
                .setCustomId("session_panel_menu")
                .setPlaceholder("- Choose an option ..")
                .setMaxValues(1)
                .addOptions([
                    { label: "- 𝗢𝗽𝗲𝗻 𝗚𝗮𝗺𝗲  .", value: "open_game" },
                    { label: "- 𝗝𝗼𝗶𝗻  .", value: "join" },
                    { label: "- 𝗔𝗹𝗲𝗿𝘁  .", value: "alert" }
                ]);

            const row = new ActionRowBuilder().addComponents(menu);

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription(
`**𝗦𝗲𝗿𝘃𝗲𝗿 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 𝗣𝗮𝗻𝗲𝗹**
**
Welcome to the** **Server Session Panel** **. This panel allows you to create a new session , announce an active session , or join an existing one with ease .

If you are hosting a session , please make sure all required information is provided before publishing your announcement . Include the session name , available slots , and any additional details that participants should know before joining .

If you are looking to participate , simply join one of the available sessions and follow the host's instructions . Please respect all participants , cooperate with the session organizer , and follow the server rules at all times to ensure a smooth and enjoyable experience .

Use the buttons below to** **Open game** , **Join** , or **Alert** . **Thank you for helping us keep our community active and organized . We hope you have an amazing experience  .**`
                );

            return interaction.reply({ embeds: [embed], components: [row], flags: [64] });
        }

        if (interaction.customId === "trip_status") {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("status_open").setLabel("𝗢𝗽𝗲𝗻").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("status_busy").setLabel("𝗕𝘂𝘀𝘆").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("status_closed").setLabel("𝗖𝗹𝗼𝘀𝗲𝗱").setStyle(ButtonStyle.Secondary)
            );

            const container = new ContainerBuilder()
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**𝗦𝗲𝗿𝘃𝗲𝗿 𝗦𝗲𝘀𝘀𝗶𝗼𝗻 𝗦𝘁𝗮𝘁𝘂𝘀**

> Welcome to the **Server Session Status** panel . This section provides real-time information about the current roleplay session , allowing all players to quickly check whether the server is **Open** , **Busy** , or **Closed** before attempting to join .

**The session status is updated regularly by the administration team to ensure that all information remains accurate and up to date . Please review the current status before joining and follow any instructions provided by the session host or staff members .

If the session is open , you are welcome to join and enjoy your roleplay experience . If the session is temporarily closed or unavailable , please wait for the next official announcement . Thank you for your patience , cooperation , and for being a valued member of the ****Bright Town**  .`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(row)
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent('-# **Bright Town RP © All Rights Reserved .**'))
                .setAccentColor(0x2f3136);

            return interaction.reply({
                flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
                components: [container],
            });
        }
    }
};