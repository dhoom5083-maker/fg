const { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    ButtonStyle 
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        
        if (interaction.isButton() && interaction.customId === 'start_ps_verification') {
            const modal = new ModalBuilder()
                .setCustomId('ps_verify_modal')
                .setTitle('PS Verification');

            const psIdInput = new TextInputBuilder()
                .setCustomId('ps_id_input')
                .setLabel('Ps iD')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const row = new ActionRowBuilder().addComponents(psIdInput);
            modal.addComponents(row);

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'ps_verify_modal') {
            const psIdAnswer = interaction.fields.getTextInputValue('ps_id_input');
            const memberCount = interaction.guild.memberCount;
            const creationTime = Math.floor(interaction.user.createdTimestamp / 1000);
            const targetChannelId = '1527377720982638856';
            const targetChannel = interaction.client.channels.cache.get(targetChannelId) || await interaction.client.channels.fetch(targetChannelId).catch(() => null);

            if (!targetChannel) return;

            const acceptBtn = new ButtonBuilder()
                .setCustomId(`psa_${interaction.user.id}_${psIdAnswer}`)
                .setLabel('Accept')
                .setEmoji('1525875170995339334')
                .setStyle(ButtonStyle.Secondary);

            const rejectBtn = new ButtonBuilder()
                .setCustomId(`psr_${interaction.user.id}`)
                .setLabel('Reject')
                .setEmoji('1525875172467408956')
                .setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder().addComponents(acceptBtn, rejectBtn);

            const embed = new EmbedBuilder()
                .setColor('Red')
                .setDescription(`:video_game: PS Activation\nPS ID: \`${psIdAnswer}\` | \`${memberCount}\`\nTime: <t:${creationTime}:R>`);

            await targetChannel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: '<a:34:1396338093841191012>', ephemeral: true });
        }

        if (interaction.isButton()) {
            if (interaction.customId.startsWith('psa_')) {
                const parts = interaction.customId.split('_');
                const targetUserId = parts[1];
                const psIdAnswer = parts.slice(2).join('_');
                const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);

                if (!targetMember) return interaction.reply({ content: '<a:34:1396338093841191012>', ephemeral: true });

                const removeRoleId = '1527377192059670772';
                const addRoleId = '1527377191267205243';

                try {
                    if (targetMember.roles.cache.has(removeRoleId)) await targetMember.roles.remove(removeRoleId);
                    await targetMember.roles.add(addRoleId);
                    
                    if (interaction.guild.ownerId !== targetMember.id) {
                        await targetMember.setNickname(psIdAnswer).catch(() => {});
                    }
                    
                    await interaction.message.edit({ components: [] });
                    await interaction.reply({ content: '<a:34:1396338093841191012>', ephemeral: true });
                } catch (error) {
                    await interaction.reply({ content: '<:emoji_245:1406543266651963463>', ephemeral: true });
                }
            }

            if (interaction.customId.startsWith('psr_')) {
                const targetUserId = interaction.customId.split('_')[1];
                const targetMember = await interaction.guild.members.fetch(targetUserId).catch(() => null);

                if (targetMember) {
                    const dmEmbed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`**𝗩𝗲𝗿𝗶𝗳𝗶𝗰𝗮𝘁𝗶𝗼𝗻 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 𝗗𝗲𝗻𝗶𝗲𝗱**\n\n**Your PlayStation verification request has been reviewed and, unfortunately, it has been** **declined**. **This may be due to incorrect or incomplete information provided during the verification process, or because your submission did not meet the server's verification requirements.**\n\n**If you believe this decision was made in error, you are welcome to submit a new verification request with the correct information or contact the staff team for further assistance. Please ensure that all details, especially your** **PSN ID**, **are accurate before submitting another request.**\n\n**Thank you for your understanding and cooperation .**`);
                    
                    await targetMember.send({ embeds: [dmEmbed] }).catch(() => {});
                }

                await interaction.message.edit({ components: [] });
                await interaction.reply({ content: '<a:34:1396338093841191012>', ephemeral: true });
            }
        }
    }
};