const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const ADMIN_STREET_ROLE = "1527377050925793320";
const lineUrl = "https://imgur.com/SMYCROp";

module.exports = {
    name: "p9",
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            await message.channel.send({ content: lineUrl });

            const menu = new StringSelectMenuBuilder()
                .setCustomId("owner_points_menu")
                .setPlaceholder("- Choose an option  .")
                .setMaxValues(1)
                .addOptions([
                    { label: "اضـافـة نـقـاط", value: "add_points" },
                    { label: "خـصـم نـقـاط", value: "remove_points" }
                ]);

            const row = new ActionRowBuilder().addComponents(menu);

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# BTRP'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`**𝗢𝘄𝗻𝗲𝗿 𝗣𝗼𝗶𝗻𝘁𝘀 𝗖𝗼𝗻𝘁𝗿𝗼𝗹 𝗣𝗮𝗻𝗲𝗹**

> Welcome to the **Owner Points Control Panel** . This panel is exclusively available to the server owner and is designed to provide complete control over the administrative points system . From here , you can manage staff points , review records , approve or deny requests , and maintain a fair and transparent reward system across the server .

**Every action performed through this panel is securely logged to ensure accountability and accurate record keeping . Please use these management tools responsibly and verify all changes before confirming any action . The points system plays an important role in evaluating staff performance , rewarding activity , and maintaining high administrative standards .

Thank you for your continued leadership and dedication to maintaining a professional , organized , and successful management team within Bright Town .**`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(row)
                .setAccentColor(0x2f3136);

            await message.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });
        } catch (error) {
            console.error(error);
        }
    }
};