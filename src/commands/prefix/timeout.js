const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'تايم',
    aliases: ['timeout'],
    async execute(message, args, client) {
        const allowedRoles = ['1394356483918921820', '1409320305964613784'];
        const hasPermission = message.member.permissions.has(PermissionFlagsBits.Administrator) || 
                              message.member.roles.cache.some(role => allowedRoles.includes(role.id));
        
        if (!hasPermission) return;

        const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!target) return message.reply('<:emoji_245:1406543266651963463>');
        if (!target.moderatable) return message.reply('<:emoji_245:1406543266651963463>');

        const durationInput = args[1];
        if (!durationInput) return message.reply('<:emoji_245:1406543266651963463>');

        const toEnglishDigits = (str) => {
            const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
            return str.replace(/[٠-٩]/g, w => arabicDigits.indexOf(w));
        };

        const cleanInput = toEnglishDigits(durationInput).toLowerCase();
        const match = cleanInput.match(/^(\d+)([smhd])$/);
        if (!match) return message.reply('<:emoji_245:1406543266651963463>');

        const value = parseInt(match[1]);
        const unit = match[2];

        let durationMs = 0;
        if (unit === 's') durationMs = value * 1000;
        else if (unit === 'm') durationMs = value * 60 * 1000;
        else if (unit === 'h') durationMs = value * 60 * 60 * 1000;
        else if (unit === 'd') durationMs = value * 24 * 60 * 60 * 1000;

        if (durationMs > 2419200000) {
            return message.reply('<:emoji_245:1406543266651963463>');
        }

        try {
            await target.timeout(durationMs, `بواسطة: ${message.author.tag}`);
            
            const lineUrl = 'https://cdn.discordapp.com/attachments/1525491050167140433/1525970227769114664/BF20BBE8-3981-4D10-BB25-A6AC57C54152.jpg?ex=6a574c45&is=6a55fac5&hm=439584d08599a84fee145edd1f8bea21c8b8a52c5c4597bf13aaa3e8992e7dc7&';
            
            const currentEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setDescription(`<a:34:1396338093841191012>\n\n**تـم فـرض عـقـوبـة الـتـايـم أوت عـلـى الـعـضـو الـمـحـدد بـنـجـاح ، وخـلال مـدة الـعـقـوبـة لـن يـتـمـكـن مـن إرسـال الـرسـائـل ، أو الـمـشـاركـة فـي الـمـحـادثـات ، أو الـتـفـاعـل مـع قـنـوات الـسـيـرفـر حـتـى انـتـهـاء الـمـدة الـمـحـددة ، أو قـيـام أحـد أفـراد الإدارة بـإزالـة الـعـقـوبـة .**\n\n**تـم اتـخـاذ هـذا الإجـراء وفـقـًا لـقـوانـيـن الـسـيـرفـر وأنـظـمـة الإشـراف ، وذلـك لـلـحـفـاظ عـلـى بـيـئـة مـنـظـمـة وآمـنـة تـضـمـن احـتـرام جـمـيـع الأعـضـاء . وفـي حـال تـكـرار الـمـخـالـفـات ، أو عـدم الالـتـزام بـالـقـوانـيـن ، قـد يـتـم اتـخـاذ إجـراءات إداريـة أخـرى ، وفـق مـا تـراه إدارة الـسـيـرفـر مـنـاسـبًـا .**\n\n> نـشـكـرك عـلـى مـسـاعـدتـك فـي الـحـفـاظ عـلـى نـظـام الـسـيـرفـر ، ونسعى دائمًا إلى توفير تجربة محترمة وممتعة لجميع الأعضاء .`);

            await message.channel.send({ content: lineUrl });
            await message.channel.send({ embeds: [currentEmbed] });
            await message.channel.send({ content: lineUrl });

            const logChannel = message.guild.channels.cache.get('1527377934493421568');
            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setColor('#FF0000')
                    .setDescription(`**Time Out\n\n<:BC:1408079616081399968> - Admin | ${message.author}\n\n<:emoji_239:1406543029933838387> - Member | ${target}\n\n<a:BC:1408081039993344160> - Duration | ${durationInput}\n\n<:emoji_277:1526581117304438884> - Bright Town System**`);

                await logChannel.send({ content: lineUrl });
                await logChannel.send({ embeds: [logEmbed] });
                await logChannel.send({ content: lineUrl });
            }
        } catch (error) {
            console.error(error);
            await message.reply('<:emoji_245:1406543266651963463>');
        }
    }
};