const { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    LabelBuilder
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton() && interaction.customId === 'defamation_btn') {
            const modal = new ModalBuilder()
                .setCustomId('defamation_modal')
                .setTitle('Defamation Form');

            const psIdInput = new TextInputBuilder()
                .setCustomId('ps_id')
                .setLabel('Ps iD')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const discordIdInput = new TextInputBuilder()
                .setCustomId('discord_id')
                .setLabel('Discord ID')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const reasonInput = new TextInputBuilder()
                .setCustomId('reason')
                .setLabel('Reason')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const actionSelect = new StringSelectMenuBuilder()
                .setCustomId("action_taken")
                .setPlaceholder("The action taken")
                .setRequired(true)
                .addOptions(
                    new StringSelectMenuOptionBuilder().setLabel("كـك").setValue("كـك"),
                    new StringSelectMenuOptionBuilder().setLabel("بـانـد").setValue("بـانـد")
                );

            const actionLabel = new LabelBuilder()
                .setLabel("The action taken")
                .setDescription("اختر الإجراء الذي تم اتخاذه")
                .setStringSelectMenuComponent(actionSelect);

            const row1 = new ActionRowBuilder().addComponents(psIdInput);
            const row2 = new ActionRowBuilder().addComponents(discordIdInput);
            const row3 = new ActionRowBuilder().addComponents(reasonInput);

            modal.addComponents(row1, row2, row3, actionLabel);

            await interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === 'defamation_modal') {
            const psId = interaction.fields.getTextInputValue('ps_id');
            const discordId = interaction.fields.getTextInputValue('discord_id');
            const reason = interaction.fields.getTextInputValue('reason');

            let actionValue = 'غير محدد';
            try {
                if (typeof interaction.fields.getStringSelectMenuValues === 'function') {
                    const values = interaction.fields.getStringSelectMenuValues('action_taken');
                    if (values && values.length > 0) actionValue = values[0];
                } else {
                    const field = interaction.fields.fields.get('action_taken');
                    if (field && field.values && field.values.length > 0) {
                        actionValue = field.values[0];
                    }
                }
            } catch (error) {
                actionValue = 'غير محدد';
            }

            const channelId = '1527377657321226350';
            const targetChannel = interaction.client.channels.cache.get(channelId) || await interaction.client.channels.fetch(channelId).catch(() => null);

            if (targetChannel) {
                const lineUrl = 'https://i.imgur.com/SMYCROp.jpg';

                const messageContent = `** <:emoji_276:1526732130661568522> | Bright Town Hall of Shame :\n\n<:emoji_296:1406517935534768270> - \` Ps iD \` :  ${psId}\n\n<:emoji_230:1394415193949343795> - \` Discord ID \` : <@${discordId}>\n\n<:emoji_275:1417526086719508570> - Reason : ${reason}\n\n<:GCRP:1525875154838618233> - procedure : ${actionValue}\n\n|| @everyone ||\n**`;

                await targetChannel.send({ content: lineUrl });
                await targetChannel.send({ content: messageContent });
                await targetChannel.send({ content: lineUrl });
            }

            await interaction.reply({ content: '<a:34:1396338093841191012>', flags: [64] });
        }
    }
}