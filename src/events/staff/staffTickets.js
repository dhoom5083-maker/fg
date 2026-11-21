const { 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MessageFlags,
    ChannelType,
    EmbedBuilder
} = require('discord.js');

const { 
    nextTicketNumber, 
    addPoint, 
    removePoint 
} = require('../../services/ticketManager');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isStringSelectMenu() && interaction.customId === 'staff_apply_menu') {
            if (interaction.values[0] === 'transfer_ticket') {
                const count = await nextTicketNumber();

                const categoryId = '1527377559770239188';
                const channelName = `Ticket-${count}`;

                const channel = await interaction.guild.channels.create({
                    name: channelName,
                    type: ChannelType.GuildText,
                    parent: categoryId,
                    topic: `opener:${interaction.user.id}|claimer:none`,
                    permissionOverwrites: [
                        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                        { id: '1527377022781755553', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                        { id: '1527377021276131512', allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                    ]
                });

                await interaction.reply({ content: `${channel}`, flags: MessageFlags.Ephemeral });

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`claim_ticket_${interaction.user.id}`).setLabel('—  اسـتـلام  .').setStyle('Secondary'),
                    new ButtonBuilder().setCustomId(`close_ticket_${interaction.user.id}`).setLabel('— قـفـل الـتـذكـرة  .').setStyle('Secondary')
                );

                const container = new ContainerBuilder()
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(text => 
                        text.setContent(`**𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝗧𝗼 Ticket 𝗦𝘂𝗽𝗽𝗼𝗿𝘁**\n\n**Thank you for contacting the Technical Support Department .\n\nOur support team is here to assist you with any technical issues , questions , or problems you may encounter within the server . Please provide a clear explanation of your issue and include any important details that may help us understand and resolve your request as quickly as possible .**\n\n**𝗣𝗹𝗲𝗮𝘀𝗲 𝗞𝗲𝗲𝗽 𝗜𝗻 𝗠𝗶𝗻𝗱  :**\n\n> — Please explain your issue clearly and accurately .\n> — Provide any necessary information or screenshots when required .\n> — Avoid sending repeated messages while your request is being reviewed .\n> — Please remain patient while a member of the support team reviews your request .\n\n**Our team will review your request and assist you as soon as possible . We appreciate your patience and cooperation while we work to provide you with the best possible support and solution .\n\n<@&1527377022781755553>  , <@${interaction.user.id}>\n\nThank you for contacting Bright Town Ticket Support** .`)
                    )
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addActionRowComponents(row)
                    .setAccentColor(0x2b2d31);

                await channel.send({ flags: MessageFlags.IsComponentsV2, components: [container] });
            }
        }

        if (interaction.isButton()) {
            const customId = interaction.customId;
            const channelTopic = interaction.channel?.topic || '';
            const claimerMatch = channelTopic.match(/claimer:(\w+)/);
            const currentClaimer = claimerMatch ? claimerMatch[1] : 'none';
            const openerMatch = channelTopic.match(/opener:(\w+)/);
            const openerId = openerMatch ? openerMatch[1] : interaction.user.id;

            if (customId.startsWith('claim_ticket_')) {
                if (currentClaimer !== 'none') {
                    return interaction.reply({ content: 'التذكرة مستلمة بالفعل ولا يمكن استلامها.', flags: MessageFlags.Ephemeral });
                }

                await interaction.channel.setTopic(`opener:${openerId}|claimer:${interaction.user.id}`);

                await addPoint(interaction.user.id);

                const lineUrl = 'https://i.imgur.com/SMYCROp.jpg';
                await interaction.channel.send({ content: lineUrl });

                const embed = new EmbedBuilder()
                    .setTitle('𝗧𝗶𝗰𝗸𝗲𝘁 𝗖𝗹𝗮𝗶𝗺𝗲𝗱')
                    .setColor(0xff0000)
                    .setDescription(`**The support ticket has been successfully claimed by a member of the support team .**\n\n**<:BC:1394414063966097560> | Ticket Member : <@${openerId}>\n\n<:BC:1408079616081399968> | Claimed By : <@${interaction.user.id}>**\n\n**This ticket is now being handled by the assigned support member . The support team member will review the request and provide assistance as soon as possible .\n\nPlease remain patient while your ticket is being reviewed and avoid sending unnecessary messages to ensure the support process remains organized and efficient .**\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗧𝗶𝗰𝗸𝗲𝘁 𝗦𝘂𝗽𝗽𝗼𝗿𝘁`);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId(`leave_ticket_${openerId}`).setLabel('—  تـرك  .').setStyle('Secondary')
                );

                await interaction.reply({ embeds: [embed], components: [row] });
            }

            if (customId.startsWith('leave_ticket_')) {
                if (currentClaimer !== interaction.user.id) {
                    return interaction.reply({ content: 'عذراً، فقط مستلم التذكرة الحالي يمكنه تركها.', flags: MessageFlags.Ephemeral });
                }

                await interaction.channel.setTopic(`opener:${openerId}|claimer:none`);

                await removePoint(interaction.user.id);

                const embed = new EmbedBuilder()
                    .setTitle('𝗧𝗶𝗰𝗸𝗲𝘁 𝗟𝗲𝗳𝘁')
                    .setColor(0xff0000)
                    .setDescription(`**The ticket has been successfully left by the user .**\n\n**<:BC:1408079616081399968> | Left By : <@${interaction.user.id}>\n\n<:BC:1394414063966097560> | Ticket Opened By : <@${openerId}>**\n\n**The ticket has been left successfully . The ticket owner is no longer actively participating in the ticket , while the ticket remains available for the support team and authorized staff members to review if further assistance is required .**\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗮𝗹 𝗦𝘂𝗽𝗽𝗼𝗿𝘁`);

                await interaction.update({ embeds: [embed], components: [] });
            }

            if (customId.startsWith('close_ticket_')) {
                if (currentClaimer !== 'none' && currentClaimer !== interaction.user.id) {
                    return interaction.reply({ content: 'فقط الإداري المستلم للتذكرة يمكنه إغلاقها.', flags: MessageFlags.Ephemeral });
                }

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId('confirm_close').setLabel('Confirm Closure').setStyle('Secondary'),
                    new ButtonBuilder().setCustomId('cancel_close').setLabel('Cancel').setStyle('Secondary')
                );

                const container = new ContainerBuilder()
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(text => 
                        text.setContent(`𝗖𝗼𝗻𝗳𝗶𝗿𝗺 𝗧𝗶𝗰𝗸𝗲𝘁 𝗖𝗹𝗼𝘀𝘂𝗿𝗲\n\n**Are you sure you want to close this ticket ?\n\nBefore confirming the closure , please make sure that your issue has been fully resolved and that you no longer require assistance from the support team .\n\nOnce the ticket is closed , the conversation may no longer be available for further support . If you still require assistance , please continue the conversation or contact the support team before confirming the closure .\n\n<:RoyaLLiFe:1525875168092754051> | Please choose an option below to continue .**\n\n**Confirm Closure** — Close the ticket permanently .\n\n**Cancel** — Keep the ticket open and continue receiving support .\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗧𝗲𝗰𝗵𝗻𝗶𝗰𝗮𝗹 𝗦𝘂𝗽𝗽𝗼𝗿𝘁`)
                    )
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addActionRowComponents(row)
                    .setAccentColor(0x2b2d31);

                await interaction.reply({ flags: MessageFlags.IsComponentsV2, components: [container] });
            }

            if (customId === 'confirm_close') {
                await interaction.channel.delete();
            }

            if (customId === 'cancel_close') {
                await interaction.message.delete();
            }
        }
    }
};