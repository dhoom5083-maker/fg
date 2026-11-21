const { 
    ActionRowBuilder, 
    StringSelectMenuBuilder, 
    MessageFlags,
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MediaGalleryItemBuilder 
} = require('discord.js');

const ADMIN_STREET_ROLE = "1527377050925793320";

module.exports = {
    name: 'p10',
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

            const menu = new StringSelectMenuBuilder()
                .setCustomId("ticket_select")
                .setMaxValues(1)
                .setPlaceholder("اختر نوع التكت")
                .addOptions([
                    { label: "Support Ticket .", value: "support", emoji: "<:BC:1408079616081399968>", description: "تذكرة الدعم الفني" },
                    { label: "Complaint Ticket .", value: "comp", emoji: "<:RoyaLLiFe:1525875168092754051>", description: "تذكرة الشكاوي" },
                    { label: "High Management Ticket .", value: "high", emoji: "<:emoji_230:1394415193949343795>", description: "تذكرة العليا" },
                    { label: "Add item Ticket .", value: "add", emoji: "<:emoji_240:1406517865766584360>", description: "تذكرة التعويض" },
                    { label: "Store Ticket .", value: "store", emoji: "<:emoji_278:1418669542766411816>", description: "تذكرة المتجر" },
                    { label: "Developers Ticket .", value: "dev", emoji: "<:emoji_267:1411183053170020413>", description: "تذكرة البرمجة" }
                ]);

            const row = new ActionRowBuilder().addComponents(menu);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP ™'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`** <:emoji_230:1394415193949343795> — Bright Town System 

<:BC89:1408079073581994115> — If you want to open a ticket in one of the tickets, you must click on one of the types of tickets below

Bright Town Management | <:emoji_276:1526732130661568522> **`
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