const { 
    ModalBuilder, 
    TextInputBuilder, 
    TextInputStyle, 
    ActionRowBuilder,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'btn_suggestions') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_suggestions')
                    .setTitle('Suggestions');

                const suggestInput = new TextInputBuilder()
                    .setCustomId('input_suggestions')
                    .setLabel('💡𝖲uggestions')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const row = new ActionRowBuilder().addComponents(suggestInput);
                modal.addComponents(row);

                await interaction.showModal(modal);
            }

            if (interaction.customId === 'btn_questions') {
                const modal = new ModalBuilder()
                    .setCustomId('modal_questions')
                    .setTitle('Questions');

                const questionInput = new TextInputBuilder()
                    .setCustomId('input_questions')
                    .setLabel('❓𝖰uestions')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                const row = new ActionRowBuilder().addComponents(questionInput);
                modal.addComponents(row);

                await interaction.showModal(modal);
            }
        }

        if (interaction.isModalSubmit()) {
            const lineUrl = 'https://i.imgur.com/SMYCROp.jpg';

            if (interaction.customId === 'modal_suggestions') {
                const suggestionText = interaction.fields.getTextInputValue('input_suggestions');
                const channel = client.channels.cache.get('1527377779610620114');

                if (channel) {
                    await channel.send({ content: lineUrl });
                    const msg = await channel.send({ 
                        content: `__** <:emoji_276:1526732130661568522>  - Bright Town Rp ™ Suggestions .**__\n\n**<:profile:1394594911541792858> - Name : ${interaction.user}\n\n💡 - Suggest : ${suggestionText}\n\n-# .\n <@&1527377043614863370>   **` 
                    });
                    try {
                        await msg.react('<:a2_True:1525875170995339334>');
                        await msg.react('<:a3_Fulse:1525875172467408956>');
                    } catch (error) {
                        console.error(error);
                    }
                    await channel.send({ content: lineUrl });
                }

                await interaction.reply({ content: '<a:GI:1525893999486046410>', flags: [MessageFlags.Ephemeral] });
            }

            if (interaction.customId === 'modal_questions') {
                const questionText = interaction.fields.getTextInputValue('input_questions');
                const channel = client.channels.cache.get('1527377778276827156');

                if (channel) {
                    await channel.send({ content: lineUrl });
                    await channel.send({ 
                        content: `__** <:emoji_276:1526732130661568522>  - Bright Town Rp ™ Suggestions .**__n\n**<:profile:1394594911541792858> - Name : ${interaction.user}\n\n❓ -  Qustions : ${questionText}\n\n-# .\n <@&1527377043614863370>   **` 
                    });
                    await channel.send({ content: lineUrl });
                }

                await interaction.reply({ content: '<a:GI:1525893999486046410>', flags: [MessageFlags.Ephemeral] });
            }
        }
    }
};