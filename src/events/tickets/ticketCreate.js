const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");
const ticketTypes = require("../../config/ticketTypes");
const ticketManager = require("../../services/ticketManager");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "ticket_select") return;

        try {
            await interaction.deferReply({ flags: [64] });
        } catch (error) {
            console.error("Failed to defer reply on ticket_select:", error);
            return;
        }

        try {
            const type = interaction.values[0];
            const config = ticketTypes[type];
            if (!config) return interaction.editReply({ content: "راجع المبرمجين" }).catch(() => null);

            const ticketNumber = await ticketManager.nextTicketNumber();
            const channelName = `Ticket-${ticketNumber}`;

            const overwrites = [
                {
                    id: interaction.guild.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                }
            ];

            for (const roleId of config.roles) {
                overwrites.push({
                    id: roleId,
                    allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
                });
            }

            const channel = await interaction.guild.channels.create({
                name: channelName,
                parent: config.category,
                permissionOverwrites: overwrites
            });

            await ticketManager.setTicket(channel.id, {
                opener: interaction.user.id,
                type: type,
                claimedBy: null
            });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("ticket_claim").setLabel("—  اسـتـلام  .").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("ticket_close").setLabel("— قـفـل الـتـذكـرة  .").setStyle(ButtonStyle.Secondary)
            );

            const mentionRoles = (config.mentions || []).map(id => `<@&${id}>`).join('  ,  ');
            const mentionLine = mentionRoles ? `${mentionRoles}  , <@${interaction.user.id}>` : `<@${interaction.user.id}>`;

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 Ticket 𝗦𝘂𝗽𝗽𝗼𝗿𝘁**

**Thank you for contacting the Technical Support Department .

Our support team is here to assist you with any technical issues , questions , or problems you may encounter within the server . Please provide a clear explanation of your issue and include any important details that may help us understand and resolve your request as quickly as possible .**

**𝗣𝗹𝗲𝗮𝘀𝗲 𝗞𝗲𝗲𝗽 𝗜𝗻 𝗠𝗶𝗻𝗱  :**

> — Please explain your issue clearly and accurately .
> — Provide any necessary information or screenshots when required .
> — Avoid sending repeated messages while your request is being reviewed .
> — Please remain patient while a member of the support team reviews your request .

**Our team will review your request and assist you as soon as possible . We appreciate your patience and cooperation while we work to provide you with the best possible support and solution .

${mentionLine}

Thank you for contacting Bright Town Ticket Support** .`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(row)
                .setAccentColor(0x2f3136);

            await channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });

            await interaction.editReply({ content: `<a:GI:1525893999486046410> | تم فتح تذكرتك : <#${channel.id}>` }).catch(() => null);

        } catch (error) {
            console.error("Error in ticket_select handler:", error);
            interaction.editReply({ content: "راجع المبرمجين" }).catch(() => null);
        }
    }
};