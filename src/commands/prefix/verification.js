const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'p3',
    description: 'Setup PlayStation Verification Center',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;
        
        await message.delete().catch(() => {});

        const lineUrl = 'https://imgur.com/SMYCROp';
        
        const embed = new EmbedBuilder()
            .setColor('#2b2d31')
            .setDescription(`# BTRP\n\n**– Welcome to the PlayStation Verification Center    .**\n\n**– To verify your PlayStation account , Please click the button below and submit your ( PSN ID ) for verification  .**\n\n**– Please make sure the ID you provide is accurate and belongs to your PlayStation account . Your request will be reviewed by our staff team as soon as possible   .**\n\n**– Once your verification has been approved , You will receive full access to the server and all available channels  .**\n\n**– Thank you for your cooperation and patience . We hope you <a:lt51:1396338904423993436> .**`)
            .setImage('https://cdn.discordapp.com/attachments/1526558291138969701/1526563039560728586/5BDB672C-1F28-45B6-A81E-8D2DE63852B2.png?ex=6a65fa9e&is=6a64a91e&hm=b91ec5d80ef7e4e70441493ef9cdfafe3a9a8f5f14dda986dd529997bee22b7f&');

        const btn = new ButtonBuilder()
            .setCustomId('start_ps_verification')
            .setLabel('- 𝗣𝗿𝗲𝘀𝘀 𝘁𝗵𝗲 𝗯𝘂𝘁𝘁𝗼𝗻 𝘁𝗼 𝗮𝗰𝘁𝗶𝘃𝗮𝘁𝗲 .')
            .setEmoji('1525875229031792721')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(btn);

        await message.channel.send({ content: lineUrl });
        await message.channel.send({ embeds: [embed], components: [row] });
    }
};