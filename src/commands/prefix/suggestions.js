const { 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionFlagsBits, 
    MessageFlags,
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MediaGalleryItemBuilder 
} = require('discord.js');

module.exports = {
    name: 'p1',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        const lineUrl = 'https://imgur.com/SMYCROp';

        try {
            await message.channel.send({ content: lineUrl });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("btn_suggestions")
                    .setLabel("- 𝗦𝘂𝗴𝗴𝗲𝘀𝘁𝗶𝗼𝗻𝘀 .")
                    .setEmoji("1526547334236737597")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("btn_questions")
                    .setLabel("- 𝗤𝘂𝗲𝘀𝘁𝗶𝗼𝗻𝘀 .")
                    .setEmoji("1406543376450326548")
                    .setStyle(ButtonStyle.Secondary)
            );

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP ™'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent('**<:emoji_252:1406543762393530429> -  Suggestions & Support Panel**\n\n**Welcome to the** **Suggestions & Support Panel** . **This section is designed to give every community member the opportunity to share ideas , provide feedback , report issues , or ask questions regarding the server .**\n\n**Whether you have a suggestion to improve gameplay , a feature request , a bug report , or simply need assistance , please submit your message clearly and respectfully . Every submission is carefully reviewed by the management team , and valuable feedback helps us improve the overall experience for everyone .**\n\n**Before submitting your request , please make sure your message is detailed , constructive , and related to the server . Thank you for helping us build a better community .**'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addMediaGalleryComponents(media =>
                    media.addItems(
                        new MediaGalleryItemBuilder()
                            .setURL("https://cdn.discordapp.com/attachments/1526558291138969701/1526563039560728586/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a65fa9e&is=6a64a91e&hm=b91ec5d80ef7e4e70441493ef9cdfafe3a9a8f5f14dda986dd529997bee22b7f&")
                    )
                )
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(row)
                .setAccentColor(0x2f3136);

            await message.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });

            await message.channel.send({ content: lineUrl });
        } catch (error) {
            console.error(error);
        }
    }
};