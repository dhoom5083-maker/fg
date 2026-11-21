const {
    EmbedBuilder,
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionsBitField
} = require("discord.js");
const ticketTypes = require("../../config/ticketTypes");
const ticketManager = require("../../services/ticketManager");
const pointsDB = require("../../services/pointsManager");

const lineUrl = "https://cdn.discordapp.com/attachments/1525871801584848967/1527400202187702362/Picsart_26-07-16_14-15-09-567.jpg?ex=6a5c8009&is=6a5b2e89&hm=c1df5c53f30450a3d59b2c0a9e5539e6e1453b5933e58d51d7789f5ec53f395d&";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;

        const ticket = await ticketManager.getTicket(interaction.channel.id);

        if (interaction.customId === "ticket_claim") {
            if (!ticket) return interaction.reply({ content: "راجع المبرمجين", ephemeral: true });

            const config = ticketTypes[ticket.type];
            const hasRole = config.roles.some(r => interaction.member.roles.cache.has(r));

            if (!hasRole && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: "<a:VF1_warn:1528011165253500988> | ما تقدر تستخدم هذا الزر", ephemeral: true });
            }

            if (ticket.claimedBy) {
                return interaction.reply({ content: "<a:VF1_warn:1528011165253500988> | التذكرة مستلمة بالفعل", ephemeral: true });
            }

            await ticketManager.updateTicket(interaction.channel.id, { claimedBy: interaction.user.id });
            await pointsDB.addPoint(interaction.user.id);

            await interaction.channel.send({ content: lineUrl });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("ticket_leave").setLabel("—  تـرك  .").setStyle(ButtonStyle.Secondary)
            );

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("𝗧𝗶𝗰𝗸𝗲𝘁 𝗖𝗹𝗮𝗶𝗺𝗲𝗱")
                .setDescription(`**The support ticket has been successfully claimed by a member of the support team .**\n\n**<:BC:1394414063966097560> | Ticket Member : <@${ticket.opener}>\n\n<:BC:1408079616081399968> | Claimed By : <@${interaction.user.id}>**\n\n**This ticket is now being handled by the assigned support member . The support team member will review the request and provide assistance as soon as possible .\n\nPlease remain patient while your ticket is being reviewed and avoid sending unnecessary messages to ensure the support process remains organized and efficient .**\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗧𝗶𝗰𝗸𝗲𝘁 𝗦𝘂𝗽𝗽𝗼𝗿𝘁`);

            return interaction.reply({ embeds: [embed], components: [row] });
        }

        if (interaction.customId === "ticket_leave") {
            if (!ticket) return interaction.reply({ content: "راجع المبرمجين", ephemeral: true });
            if (ticket.claimedBy !== interaction.user.id) {
                return interaction.reply({ content: "<a:VF1_warn:1528011165253500988> | ما تقدر تستخدم هذا الزر", ephemeral: true });
            }

            await interaction.deferUpdate();

            await pointsDB.removePoints(interaction.user.id, 1);
            await ticketManager.updateTicket(interaction.channel.id, { claimedBy: null });

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("𝗧𝗶𝗰𝗸𝗲𝘁 𝗟𝗲𝗳𝘁")
                .setDescription(`**The support ticket has been successfully left by the user .
The ticket will remain available for the support team and authorized staff members to review if further assistance is required . If you still need help with your issue , please make sure to provide all necessary information and wait for a member of the support team to respond .**
> Thank you for contacting **Bright Town Technical Support** .`);

            return interaction.editReply({ embeds: [embed], components: [] });
        }

        if (interaction.customId === "ticket_close") {
            if (!ticket) return interaction.reply({ content: "راجع المبرمجين", ephemeral: true });

            if (ticket.claimedBy && ticket.claimedBy !== interaction.user.id && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({ content: "<a:VF1_warn:1528011165253500988> | ما تقدر تستخدم هذا الزر", ephemeral: true });
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId("ticket_confirm_close").setLabel("Confirm Closure").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId("ticket_cancel_close").setLabel("Cancel").setStyle(ButtonStyle.Secondary)
            );

            const container = new ContainerBuilder()
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(`𝗖𝗼𝗻𝗳𝗶𝗿𝗺 𝗧𝗶𝗰𝗸𝗲𝘁 𝗖𝗹𝗼𝘀𝘂𝗿𝗲`))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(`**Are you sure you want to close this ticket ?\n\nBefore confirming the closure , please make sure that your issue has been fully resolved and that you no longer require assistance from the support team .\n\nOnce the ticket is closed , the conversation may no longer be available for further support . If you still require assistance , please continue the conversation or contact the support team before confirming the closure .\n\n<:RoyaLLiFe:1525875168092754051> | Please choose an option below to continue .**\n\n**Confirm Closure** — Close the ticket permanently .\n\n**Cancel** — Keep the ticket open and continue receiving support .\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗮𝗹 𝗦𝘂𝗽𝗽𝗼𝗿𝘁`))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(row)
                .setAccentColor(0x2f3136);

            return interaction.reply({
                flags: MessageFlags.IsComponentsV2,
                components: [container]
            });
        }

        if (interaction.customId === "ticket_confirm_close") {
            await interaction.deferUpdate();
            await ticketManager.deleteTicket(interaction.channel.id);
            return interaction.channel.delete().catch(() => null);
        }

        if (interaction.customId === "ticket_cancel_close") {
            return interaction.message.delete().catch(() => null);
        }
    }
};