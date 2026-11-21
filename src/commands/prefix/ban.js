const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'باند',
    aliases: ['بنعالي', 'زوط', 'ختفو', 'ban'],
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply('مـنـشـن الـعـضـو');
        if (!target.bannable) return message.reply('مـايـمـديـك تـبـنـد الـشـخـص ذا');

        try {
            const lineUrl = 'https://cdn.discordapp.com/attachments/1525491050167140433/1525970227769114664/BF20BBE8-3981-4D10-BB25-A6AC57C54152.jpg?ex=6a589dc5&is=6a574c45&hm=76dadffedbc50dbbef987969e9eb7fe356df242d8616dd89db529865f8fd11ee&';
            
            await target.ban({ reason: `بواسطة: ${message.author.tag}` });

            await message.channel.send({ content: `✅ **تم حظر <@${target.id}> من السيرفر! ✈️**` });
            await message.channel.send({ content: lineUrl });

            const logChannel = message.guild.channels.cache.get('1527377934493421568');
            if (logChannel) {
                const embed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`__**<:emoji_276:1526732130661568522> - Bright Town RP ™ .**__\n\n**تـم تـسـجـيـل عـمـلـيـة الـحـظـر بـنـجـاح ، وقـد تـم تـنـفـيـذ هـذا الإجـراء الإداري وفـقـًا لـقـوانـيـن الـسـيـرفـر واللـوائـح الـمـعـتـمـدة لـدى إدارة الـسـيـرفـر ، وذلـك لـلـحـفـاظ عـلـى نـظـام الـمـجـتـمـع وتـوفـيـر بـيـئـة آمـنـة ومـحـتـرمـة لـجـمـيـع الأعـضـاء .**\n\n**الـمـسـؤول الـمـنـفـذ :** ( ${message.author} )\n\n**الـعـضـو الـمـحـظـور :** ( <@${target.id}> )\n\n**تـم تـوثـيـق هـذه الـعـمـلـيـة داخـل سـجـلات الإدارة ، وسـيـتـم الاحـتـفـاظ بـجـمـيـع الـبـيـانـات الـخـاصـة بـهـذا الإجـراء لـضـمـان الـشـفـافـيـة وإمـكـانـيـة الـرجـوع إلـيـهـا عـنـد الـحـاجـة . ويُـرجـى الـعـلـم أن جـمـيـع قـرارات الـحـظـر تـتـم بـنـاءً عـلـى مـراجـعـة الـمـخـالـفـة والـتـأكـد مـن مـخـالـفـتـهـا لـقـوانـيـن الـسـيـرفـر ، وبـمـا يـحـقـق الـعـدالـة بـيـن جـمـيـع الأعـضـاء .**\n\n**نـشـكـرك عـلـى مـسـاعـدتـك فـي الـحـفـاظ عـلـى نـظـام الـسـيـرفـر ، ونسعى دائمًا إلى توفير مجتمع منظم ، آمن ، واحترافي للجميع .**`);

                await logChannel.send({ content: lineUrl });
                await logChannel.send({ embeds: [embed] });
                await logChannel.send({ content: lineUrl });
            }
        } catch (error) {
            console.error(error);
            await message.reply('<:emoji_245:1406543266651963463>');
        }
    }
};