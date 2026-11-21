const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require('discord.js');
const { welcome } = require('../../config/ids');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {
        const welcomeText = `**Welcome To bright town\n\nPlayer : ${member}\nMember Number : ${member.guild.memberCount}\n\nWelcome to bright town We are delighted to welcome you to our community and truly appreciate your decision to join us Our goal is to provide a professional realistic and enjoyable roleplay environment where every player can create unforgettable memories build unique stories and become part of an active and friendly community We hope your time here is filled with exciting adventures new friendships and countless enjoyable moments throughout your journey\n\nBefore you begin your adventure we highly recommend taking a few moments to read the server rules complete the verification process and explore the available channels This will help you understand all server systems features and community guidelines allowing you to enjoy the best possible experience from your very first day\n\nIf you ever need assistance have any questions encounter technical issues or simply need guidance our administration team is always available and ready to help you We are committed to providing support whenever it is needed to ensure every member enjoys a safe fair and enjoyable experience within the server\n\nThank you once again for choosing bright town We sincerely hope you enjoy every moment spent here and become an important part of our growing community We wish you the very best of luck and an incredible roleplay experience Have fun and enjoy your stay\n\n-# لـغـة عـربـيـة\n\nنـرحـب بـك أجـمـل تـرحـيـب فـي بـرايـت تـاون ونـسـعـد جـدًا بـانـضـمـامـك إلـى مـجـتـمـعـنـا نـأمـل أن تـقـضـي وقـتًـا مـمـيـزًا مـلـيـئًـا بـالـمـغـامـرات والـلـحـظـات الـرائـعـة وأن تـسـتـمـتـع بـتـجـربـة لـعـب واقـعـي احـتـرافـيـة تـوفـر لـك كـل مـا تـحـتـاجـه لـصـنـاعـة قـصـتـك الـخـاصـة داخـل الـمـديـنـة\n\nنـنـصـحـك قـبـل بـدء رحـلـتـك بـقـراءة قـوانـيـن الـسـيـرفـر وإكـمـال الـتـفـعـيـل والاطـلاع عـلـى الأقـسـام الـمـتـاحـة حـتـى تـتـعـرف عـلـى جـمـيـع الأنـظـمـة والـخـدمـات والـمـمـيـزات الـمـوجـودة وتـبـدأ تـجـربـتـك بـالـشـكـل الـصـحـيـح\n\nإذا احـتـجـت إلـى أي مـسـاعـدة أو واجـهـت أي مـشـكـلـة أو كـان لـديـك أي اسـتـفـسـار فـلا تـتـردد فـي الـتـواصـل مـع فـريـق الإدارة فـنـحـن مـتـواجـدون لـخـدمـتـك والـحـرص عـلـى تـوفـيـر أفـضـل تـجـربـة مـمـكـنـة لـجـمـيـع الأعـضـاء\n\nشـكـرًا لاخـتـيـارك بـرايـت تـاون ونتمنى أن تـكـون هـذه بـدايـة رحـلـة مـلـيـئـة بـالـنـجـاح والـمـتـعـة والـذكـريـات الـجـمـيـلـة ونـتـطـلـع إلـى رؤيـتـك تـصـبـح أحـد أبـرز أعـضـاء مـجـتـمـعـنـا**`;

        const buttons = [];
        if (/^\d{17,20}$/.test(welcome.rulesChannelId)) {
            buttons.push(
                new ButtonBuilder()
                    .setLabel("Rules .")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${member.guild.id}/${welcome.rulesChannelId}`)
            );
        }
        if (/^\d{17,20}$/.test(welcome.verifyChannelId)) {
            buttons.push(
                new ButtonBuilder()
                    .setLabel("Verification .")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`https://discord.com/channels/${member.guild.id}/${welcome.verifyChannelId}`)
            );
        }

        const embed = new EmbedBuilder()
            .setTitle('BTRP ™')
            .setDescription(welcomeText)
            .setImage("https://cdn.discordapp.com/attachments/1526558291138969701/1526561422916718662/173CE54F-94A0-469E-AC5C-F00E02669324.png?ex=6a57789d&is=6a56271d&hm=9fe16ab2c878b8bbd982e7cd46f36a3b711ced62fd00cd0d901a935759ad54b5&")
            .setColor(0x2f3136);

        const payload = { embeds: [embed] };
        if (buttons.length) {
            payload.components = [new ActionRowBuilder().addComponents(buttons)];
        }

        try {
            await member.send({ content: welcome.lineUrl });
            await member.send(payload);
            await member.send({ content: welcome.lineUrl });
        } catch (error) {
            if (error.code !== 50007) {
                console.error('[welcome]', error);
            }
        }
    }
};
