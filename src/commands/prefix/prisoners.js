const { 
    MessageFlags,
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require('discord.js');

// رتبت الادمن ستريت 
const ADMIN_STREET_ROLE = "1527377050925793320";

module.exports = {
    name: 'p4',
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        const lineUrl = 'https://imgur.com/SMYCROp';

        try {
            await message.channel.send({ content: lineUrl });

            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("violators_menu")
                    .setPlaceholder("- Choose an option  .")
                    .setMaxValues(1)
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel("- 𝗜𝗺𝗽𝗿𝗶𝘀𝗼𝗻  .")
                            .setValue("imprison"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("- 𝗥𝗲𝗹𝗲𝗮𝘀𝗲  .")
                            .setValue("release"),
                        new StringSelectMenuOptionBuilder()
                            .setLabel("- 𝗣𝗿𝗶𝘀𝗼𝗻 𝗥𝗲𝗰𝗼𝗿𝗱𝘀 .")
                            .setValue("records")
                    )
            );

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**𝗦𝗲𝗿𝘃𝗲𝗿 𝗩𝗶𝗼𝗹𝗮𝘁𝗼𝗿𝘀 𝗣𝗮𝗻𝗲𝗹**

> Welcome to the **Server Violators Panel** . This section is dedicated to documenting members who have violated the server rules and received administrative actions after a complete review by the moderation team .

**Every case displayed in this panel has been carefully investigated and verified according to the server regulations . The purpose of this panel is to maintain transparency , encourage members to respect the community guidelines , and provide a clear record of confirmed violations .
Please remember that all administrative decisions are made fairly and based on valid evidence . Any attempt to spread false information , harass other members , or violate the server rules may result in additional disciplinary actions .
We encourage every member to follow the community guidelines , respect fellow members , and contribute to creating a safe , friendly , and professional environment for everyone . Thank you for helping us maintain the quality and integrity of our community .**`
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