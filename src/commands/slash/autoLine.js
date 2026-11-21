const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const autoLine = require('../../services/autoLine');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('خط_تلقائي')
        .setDescription('تحديد روم لإرسال الخط التلقائي به أو إزالته')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('الشات')
                .setDescription('الشات المراد تفعيل أو إلغاء الخط التلقائي فيه')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('الاجراء')
                .setDescription('هل تريد إضافة أم إزالة الشات؟')
                .setRequired(true)
                .addChoices(
                    { name: 'إضافة', value: 'add' },
                    { name: 'إزالة', value: 'remove' }
                )
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('الشات');
        const action = interaction.options.getString('الاجراء');

        if (action === 'add') {
            await autoLine.addChannel(channel.id);
            await interaction.reply({
                content: 'تـم وضـع شـات بـنـجـاح  .',
                flags: [MessageFlags.Ephemeral]
            });
        } else if (action === 'remove') {
            await autoLine.removeChannel(channel.id);
            await interaction.reply({
                content: 'تـم إزالـة شـات بـنـجـاح  .',
                flags: [MessageFlags.Ephemeral]
            });
        }
    }
};
