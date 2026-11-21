const { 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MediaGalleryItemBuilder,
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'p2',
    aliases: [],
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        await message.delete().catch(() => {});

        const lineUrl = 'https://imgur.com/SMYCROp';

        const description = `**𝗘𝘅𝗽𝗼𝘀𝘂𝗿𝗲 𝗣𝗮𝗻𝗲𝗹\n\nWelcome to the Official Exposure Panel . This section has been created to provide transparency by presenting verified cases that have been carefully reviewed by the administration team Every decision is made only after reviewing all available evidence and listening to every side involved whenever necessary . This process guarantees that all actions remain transparent and based on facts rather than assumptions .\n\nThank you for respecting the rules of this panel and for helping us build a community based on integrity , fairness , trust , and mutual respect . Your cooperation allows us to maintain a safe and enjoyable environment for every member of Bright Town .\n\n-# لـغـة عـربـيـة\n\nلــوحــة إظــهــار الــحــقــائــق\n\nمرحبًا بك في لوحة إظهار الحقائق الرسمية . تم إنشاء هذه اللوحة لتكون مرجعًا رسميًا لعرض الحالات التي تم التحقق منها بشكل كامل بعد مراجعتها من قبل فريق الإدارة . \n\nنشكر جميع الأعضاء على تعاونهم والتزامهم بأنظمة السيرفر ، ونسعى دائمًا إلى بناء مجتمع احترافي يقوم على الصدق والعدالة والاحترام المتبادل ، حتى تبقى تجربة الجميع داخل بـرايـت تـاون آمنة ومنظمة وممتعة للجميع .\n**`;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('defamation_btn')
                .setLabel('- 𝗗𝗲𝗳𝗮𝗺𝗮𝘁𝗶𝗼𝗻 𝗕𝘂𝘁𝘁𝗼𝗻   .')
                .setEmoji('1408079073581994115')
                .setStyle(ButtonStyle.Secondary)
        );

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text => text.setContent('# BTRP'))
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(text => text.setContent(description))
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

        await message.channel.send({ content: lineUrl });
        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });
        await message.channel.send({ content: lineUrl });
    }
};