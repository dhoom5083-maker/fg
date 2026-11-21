const { 
    PermissionFlagsBits, 
    MessageFlags,
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MediaGalleryItemBuilder 
} = require('discord.js');

module.exports = {
    name: 'امبد',
    aliases: ['embed'],
    async execute(message, args, client) {
        if (!message.guild || !message.member) return;
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        const question = await message.channel.send('الـرسـالـة ؟');

        const filter = (m) => m.author.id === message.author.id;
        const collector = message.channel.createMessageCollector({ filter, max: 1, time: 60000 });

        collector.on('collect', async (m) => {
            const answer = m.content;

            try {
                await m.delete();
                await question.delete();
            } catch (error) {
                console.error(error);
            }

            const lineUrl = 'https://imgur.com/SMYCROp';

            try {
                await message.channel.send({ content: lineUrl });

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(text => text.setContent('# BTRP ™'))
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(text => text.setContent(answer))
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addMediaGalleryComponents(media =>
                        media.addItems(
                            new MediaGalleryItemBuilder()
                                .setURL("https://cdn.discordapp.com/attachments/1528562019203022969/1528562123201056809/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a660029&is=6a64aea9&hm=084bc945edb327ae2d77e5c88be29775c3ebcc2758ad01507b309426bb0d7b0f&")
                        )
                    )
                    .setAccentColor(0x830000);

                await message.channel.send({
                    flags: MessageFlags.IsComponentsV2,
                    components: [container],
                });

                await message.channel.send({ content: lineUrl });
            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time' && collected.size === 0) {
                try {
                    await question.delete();
                } catch (error) {
                    console.error(error);
                }
            }
        });
    }
};