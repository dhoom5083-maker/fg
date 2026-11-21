const { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle,
    PermissionFlagsBits,
    MessageFlags
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    once: false,
    async execute(interaction, client) {
        const lineUrl = 'https://i.imgur.com/SMYCROp.jpg';

        if ((interaction.isStringSelectMenu() && interaction.customId === 'staff_apply_menu' && interaction.values[0] === 'staff_apply') || (interaction.isButton() && interaction.customId === 'staff_apply')) {
            const modal = new ModalBuilder()
                .setCustomId('staff_modal')
                .setTitle('Staff Application');

            const q1 = new TextInputBuilder()
                .setCustomId('q1')
                .setLabel('أسـمك :')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const q2 = new TextInputBuilder()
                .setCustomId('q2')
                .setLabel('عـمـرك الـحـقـيقـي :')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const q3 = new TextInputBuilder()
                .setCustomId('q3')
                .setLabel('هل سبق وكنت إداري؟ وماهي خبراتك؟')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const q4 = new TextInputBuilder()
                .setCustomId('q4')
                .setLabel('سبب دخولك للإدارة؟ وماذا ستقدم؟')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const q5 = new TextInputBuilder()
                .setCustomId('q5')
                .setLabel('هل ستلتزم بجميع القوانين؟')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            modal.addComponents(
                new ActionRowBuilder().addComponents(q1),
                new ActionRowBuilder().addComponents(q2),
                new ActionRowBuilder().addComponents(q3),
                new ActionRowBuilder().addComponents(q4),
                new ActionRowBuilder().addComponents(q5)
            );

            await interaction.showModal(modal).catch(() => {});
        }

        if (interaction.isModalSubmit() && interaction.customId === 'staff_modal') {
            await interaction.reply({ content: 'تم إرسال تقديمك بنجاح', flags: MessageFlags.Ephemeral }).catch(() => {});

            const ans1 = interaction.fields.getTextInputValue('q1');
            const ans2 = interaction.fields.getTextInputValue('q2');
            const ans3 = interaction.fields.getTextInputValue('q3');
            const ans4 = interaction.fields.getTextInputValue('q4');
            const ans5 = interaction.fields.getTextInputValue('q5');

            const logChannel = client.channels.cache.get('1527377774086455539');
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setTitle('**Admin application**')
                    .setColor('Red')
                    .setDescription(`『﷽』\n\n**__(\` Bright Town ( Admin application questionnaire \`)\n\n<@${interaction.user.id}>\n\n1) - أسـمك :  ${ans1}\n\n2) - عـمـرك الـحـقـيقـي :  ${ans2}\n\n3) - هـل سـبـق وكـنت إداري و خـبـراتـك الإداريـة :  ${ans3}\n\n4) - سـبـب دخــولـك لـلإدارة ومـاذا سـوف تـقـدم :  ${ans4}\n\n5) - هـل سـتـلتـزم بـجـميـع الـقـوانـيـن  :   ${ans5}\n  __**`);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId(`accept_${interaction.user.id}`)
                        .setLabel('Accept')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId(`reject_${interaction.user.id}`)
                        .setLabel('Reject')
                        .setStyle(ButtonStyle.Secondary)
                );

                await logChannel.send({ embeds: [embed], components: [row] }).catch(() => {});
                await logChannel.send({ content: lineUrl }).catch(() => {});
            }
        }

        if (interaction.isButton() && interaction.customId.startsWith('accept_')) {
            const userId = interaction.customId.split('_')[1];
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'لا تملك صلاحية', flags: MessageFlags.Ephemeral }).catch(() => {});
            }

            const targetMember = await interaction.guild.members.fetch(userId).catch(() => null);
            if (targetMember) {
                await targetMember.roles.add('1527377115786379464').catch(() => {});
                
                const dmEmbed = new EmbedBuilder()
                    .setTitle('𝗣𝗿𝗲𝗹𝗶𝗺𝗶𝗻𝗮𝗿𝘆 𝗔𝗰𝗰𝗲𝗽𝘁𝗮𝗻𝗰𝗲')
                    .setColor('Red')
                    .setDescription(`**Congratulations**\n\n> We are pleased to inform you that your application to join the **Bright Town Administration Team** has been **preliminarily accepted** .\n\n**<:BC:1394414063966097560>  | User : <@${userId}>**\n\n**Your application has successfully passed the initial review stage . This means that your application has been reviewed by the responsible administration team and has met the initial requirements for joining the team .\n\nPlease note that this is a preliminary acceptance and does not represent the final acceptance into the administration . You may be required to complete additional steps , attend an interview , or undergo a final evaluation before your official appointment .\n\nWe appreciate your interest in joining the Bright Town Administration Team and look forward to seeing your dedication , activity , professionalism , and ability to work as part of the team .\n\nPlease remain patient and wait for further instructions from the responsible administration team .\n\nCongratulations once again , and we wish you the best of luck in the next stage of your application .**\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗔𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗶𝗼𝗻`);

                await targetMember.send({ embeds: [dmEmbed] }).catch(() => {});
                await targetMember.send({ content: lineUrl }).catch(() => {});
            }

            await interaction.reply({ content: 'تم قبول العضو بنجاح', flags: MessageFlags.Ephemeral }).catch(() => {});
            await interaction.message.edit({ components: [] }).catch(() => {});
        }

        if (interaction.isButton() && interaction.customId.startsWith('reject_')) {
            const userId = interaction.customId.split('_')[1];
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                return interaction.reply({ content: 'لا تملك صلاحية', flags: MessageFlags.Ephemeral }).catch(() => {});
            }

            const targetMember = await interaction.guild.members.fetch(userId).catch(() => null);
            if (targetMember) {
                const dmEmbed = new EmbedBuilder()
                    .setTitle('𝗦𝘁𝗮𝗳𝗳 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗗𝗲𝗻𝗶𝗲𝗱')
                    .setColor('Red')
                    .setDescription(`> We regret to inform you that your application to join the **Bright Town Administration Team** has been reviewed and **denied** .\n\n<:BC:1394414063966097560> | User : <@${userId}>\n\n**After carefully reviewing your application and the information provided , the administration team has decided not to accept your application at this time . This decision may be based on the current requirements , the information provided in your application , or the administration's current staffing needs .\n\nPlease do not be discouraged by this decision . You may have the opportunity to submit a new application in the future when applications are available . We encourage you to continue being active , respectful , and involved within the Bright Town community .\n\nThank you for your interest in joining the administration team and for taking the time to submit your application . We appreciate your effort and wish you the best of luck in the future .**\n\n𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗔𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗶𝗼𝗻`);

                await targetMember.send({ embeds: [dmEmbed] }).catch(() => {});
                await targetMember.send({ content: lineUrl }).catch(() => {});
            }

            await interaction.reply({ content: 'تم رفض العضو بنجاح', flags: MessageFlags.Ephemeral }).catch(() => {});
            await interaction.message.edit({ components: [] }).catch(() => {});
        }
    }
};