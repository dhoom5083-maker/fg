const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const ADMIN_STREET_ROLE = "1527377050925793320";
const lineUrl = "https://imgur.com/SMYCROp";

module.exports = {
    name: "p8",
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            await message.channel.send({ content: lineUrl });

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("admin_points_panel")
                    .setEmoji("1527743450827587835")
                    .setStyle(ButtonStyle.Secondary)
            );

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**Welcome to the Administrative Points Management Panel . This panel is designed exclusively for authorized staff members to manage the server's points system in a secure , organized , and professional manner . Through this panel , administrators can add , remove , edit , or review members' points while maintaining complete accuracy and fairness .

Please ensure that every points adjustment is based on valid reasons and follows the server's regulations and internal administrative policies . All point transactions are recorded for transparency and may be reviewed by senior management whenever necessary .

Thank you for helping us maintain a fair and reliable points system for everyone in Bright Town .**`
                ))
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