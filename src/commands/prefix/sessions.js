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
    name: "p6",
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
                    .setCustomId("trip_session")
                    .setEmoji("1406543369269936139")
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId("trip_status")
                    .setEmoji("1406542926976253952")
                    .setStyle(ButtonStyle.Secondary)
            );

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**𝗦𝗲𝗿𝘃𝗲𝗿 𝗧𝗿𝗶𝗽 𝗦𝘆𝘀𝘁𝗲𝗺**
**
Welcome to the** **Server Trip System** . **This feature allows players to travel between different locations across the city while enjoying a smooth and immersive roleplay experience . Every trip has its own destination , travel duration , and requirements , providing a realistic transportation system for all members .

Before starting a trip , please make sure you have selected the correct destination and meet any necessary requirements . Once your journey begins , the travel process will continue until you safely arrive at your selected location .

Our trip system is designed to improve immersion , encourage exploration , and provide a more realistic way of moving throughout the server . Please use this system responsibly and follow all server rules while traveling .

Thank you for using the** . **Server Trip System** .** We wish you a safe journey and an enjoyable roleplay experience throughout  .**`
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