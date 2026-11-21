const { MessageFlags, ContainerBuilder, SeparatorSpacingSize, MediaGalleryItemBuilder } = require("discord.js");
const guildBase = require("../../services/guildBase");

const STATUS_EMOJIS = {
    status_open: "<:BC:1394414895751233737>",
    status_busy: "<:BC:1394414943297736766>",
    status_closed: "<:BC:1394414989703516352>"
};

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isButton()) return;
        if (!["status_open", "status_busy", "status_closed"].includes(interaction.customId)) return;

        await interaction.deferReply({ flags: [64] });

        let data = await guildBase.findOne({ guild: interaction.guild.id });
        if (!data || !data.serverStatusMsg?.channel || !data.serverStatusMsg?.message) {
            return interaction.editReply({ content: "راجع المبرمجين" });
        }

        const channel = interaction.guild.channels.cache.get(data.serverStatusMsg.channel);
        if (!channel) return interaction.editReply({ content: "راجع المبرمجين" });

        const targetMessage = await channel.messages.fetch(data.serverStatusMsg.message).catch(() => null);
        if (!targetMessage) return interaction.editReply({ content: "راجع المبرمجين" });

        const emoji = STATUS_EMOJIS[interaction.customId];

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text => text.setContent(
`**<:emoji_276:1526732130661568522> - 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗦𝗲𝗿𝘃𝗲𝗿 𝗦𝘁𝗮𝘁𝘂𝘀 .**

> **– Status : ( ${emoji} ) .**

**<:GCRP:1525875154838618233> - The server is currently unavailable due to temporary maintenance or technical updates . Please wait until the administration announces that the server is back online . Thank you for your patience and understanding .**
-# **Bright Town RP © All Rights Reserved .**`
            ))
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addMediaGalleryComponents(media =>
                media.addItems(
                    new MediaGalleryItemBuilder()
                        .setURL("https://cdn.discordapp.com/attachments/1526558291138969701/1526563039560728586/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a5b6e9e&is=6a5a1d1e&hm=72573e4a29d9635747ff9a707e52c3abc1754ce87e7c5a4c8c4d8c18e9ab29e0&")
                )
            )
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(text => text.setContent('-# **Bright Town RP © All Rights Reserved .**'))
            .setAccentColor(0x2f3136);

        await targetMessage.edit({
            flags: MessageFlags.IsComponentsV2,
            components: [container],
        });

        const pingMsg = await channel.send({ content: "@everyone" });
        await pingMsg.delete().catch(() => null);

        return interaction.editReply({ content: "<a:34:1396338093841191012> | تم تحديث حالة السيرفر بنجاح" });
    }
};