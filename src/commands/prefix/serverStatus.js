const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    MediaGalleryItemBuilder
} = require("discord.js");
const guildBase = require("../../services/guildBase");

const ADMIN_STREET_ROLE = "1527377050925793320";
const lineUrl = "https://imgur.com/SMYCROp";

module.exports = {
    name: "p7",
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            await message.channel.send({ content: lineUrl });

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent(
`**<:emoji_276:1526732130661568522> - 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗦𝗲𝗿𝘃𝗲𝗿 𝗦𝘁𝗮𝘁𝘂𝘀 .**

> **– Status : ( <:BC:1394414989703516352>  𝗢𝗳𝗳𝗹𝗶𝗻𝗲 ) .**

**<:GCRP:1525875154838618233> - The server is currently unavailable due to temporary maintenance or technical updates . Please wait until the administration announces that the server is back online . Thank you for your patience and understanding .**
-# **Bright Town RP © All Rights Reserved .**`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addMediaGalleryComponents(media =>
                    media.addItems(
                        new MediaGalleryItemBuilder()
                            .setURL("https://cdn.discordapp.com/attachments/1526558291138969701/1526563039560728586/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a65fa9e&is=6a64a91e&hm=b91ec5d80ef7e4e70441493ef9cdfafe3a9a8f5f14dda986dd529997bee22b7f&")
                    )
                )
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent('-# **Bright Town RP © All Rights Reserved .**'))
                .setAccentColor(0x2f3136);

            const sentMessage = await message.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });

            await guildBase.setServerStatusMsg(message.guild.id, message.channel.id, sentMessage.id);

        } catch (error) {
            console.error(error);
        }
    }
};