const { 
    PermissionFlagsBits, 
    ActionRowBuilder, 
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ContainerBuilder, 
    SeparatorSpacingSize, 
    MessageFlags 
} = require('discord.js');

module.exports = {
    name: 'p11',
    async execute(message, args, client) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) return;

        await message.delete().catch(() => {});

        const lineUrl = 'https://cdn.discordapp.com/attachments/1527377822354510037/1528885153072418967/info.png?ex=6a65db81&is=6a648a01&hm=a85da9f8bc41d3a156518d331d2ef4d7de664bf17873f142e506968439e28945&';

        await message.channel.send({ content: lineUrl });

        const menu = new StringSelectMenuBuilder()
            .setCustomId("staff_apply_menu")
            .setPlaceholder("- Choose an option .")
            .setMaxValues(1)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel("تـقـديـم إدارة")
                    .setValue("staff_apply")
                    .setDescription("تـقـديـم عـلـى الإدارة")
                    .setEmoji("1395599624898609212"),
                new StringSelectMenuOptionBuilder()
                    .setLabel("نـقـل")
                    .setValue("transfer_ticket")
                    .setDescription("طـلـب نـقـل")
                    .setEmoji("1395599624898609212")
            );

        const row = new ActionRowBuilder().addComponents(menu);

        const container = new ContainerBuilder()
            .addTextDisplayComponents(text =>
                text.setContent(`# 𝗦𝘁𝗮𝗳𝗳 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻𝘀`)
            )
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addTextDisplayComponents(text =>
                text.setContent(`**Welcome to the official Staff Application Panel** .\n\n**If you are interested in joining the Bright Town administration team , you can submit your application through this panel . We are always looking for active , responsible , respectful , and dedicated members who are willing to contribute to the community and help maintain a professional environment for everyone** \n\n𝗕𝗲𝗳𝗼𝗿𝗲 𝗦𝘂𝗯𝗺𝗶𝘁𝘁𝗶𝗻𝗴 𝗬𝗼𝘂𝗿 𝗔𝗽𝗽𝗹𝗶𝗰𝗮𝘁𝗶𝗼𝗻   :\n\n-# — Make sure all information provided is accurate and complete .\n-# — Read and understand the staff requirements before applying .\n-# — Be honest when answering all application questions .\n-# — Make sure you have enough time and activity to fulfill your responsibilities .\n-# — Respect the administration team and follow all server regulations .\n\n**All applications will be carefully reviewed by the responsible administration team . Submitting an application does not guarantee acceptance , and every application will be evaluated based on the applicant's activity , behavior , experience , maturity , and ability to work as part of a team .\n\nIf your application is accepted , a member of the administration team will contact you with the next steps . If your application is rejected , you may apply again in the future when applications are available .**\n\n> Thank you for your interest in joining the **Bright Town Administration Team** .`)
            )
            .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
            .addActionRowComponents(row)
            .setAccentColor(0x2f3136);

        await message.channel.send({
            flags: MessageFlags.IsComponentsV2,
            components: [container]
        });

        await message.channel.send({ content: lineUrl });
    }
};