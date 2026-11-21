const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    MediaGalleryItemBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
    name: "p5",
    async execute(message, args, client) {

        const rulesRow = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("rules_menu")
                .setMaxValues(1)
                .setPlaceholder("Rules Menu")
                .addOptions([
                    { label: "قوانين العامة", value: "general_rules", description: "جميع قوانين السيرفر والدسكورد", emoji: "<:GCRP:1352677225706557531>" },
                    { label: "Gangs Rules", value: "gangs_rules", description: "قوانين السرقات والخطف", emoji: "<:GCRP:1352799829671280671>" },
                    { label: "Injury Rules", value: "injury_rules", description: "قوانين الإسقاط والمستشفى", emoji: "<:GCRP:1352677203975868548>" },
                    { label: "Terms Server", value: "terms_server", description: "مصطلحات السيرفر", emoji: "<:GCRP:1352677186548535336>" },
                    { label: "Safe Zone", value: "safe_zone", description: "عرض صور المناطق الآمنة", emoji: "<:GCRP:1352677175261794327>" }
                ])
        );

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text =>
                text.setContent(`** > Server Rules — قوانين السيرفر\n<:BC89:1408079073581994115> - All rules of Bright Town are listed in the menu\nAll regulations are strictly reserved and protected byBright Town\nBy joining or using our services you automatically agree to comply with these rules Any violation will lead to action in accordance with the stated regulations\nBright Town reserves the right to update modify or enforce these rules at any time to maintain fairness and order <:a2_True:1525875170995339334>  . \n\n-# Bright Town Management | <:BC:1408079616081399968> **`)
            )
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addActionRowComponents(rulesRow)
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addMediaGalleryComponents(media =>
                media.addItems(
                    new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1526558291138969701/1526563039560728586/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a65fa9e&is=6a64a91e&hm=b91ec5d80ef7e4e70441493ef9cdfafe3a9a8f5f14dda986dd529997bee22b7f&")
                )
            )
            .setAccentColor(0xff0000);

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
        });
    }
};