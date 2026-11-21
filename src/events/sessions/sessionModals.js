const { EmbedBuilder, MessageFlags, ContainerBuilder, SeparatorSpacingSize } = require("discord.js");
const pointsManager = require("../../services/pointsManager");

const OPEN_GAME_CHANNEL = "1527377788632301571";
const JOIN_ALERT_CHANNEL = "1527377790746230935";
const lineUrl = "https://i.imgur.com/SMYCROp.jpg";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === "open_game_modal") {
            await interaction.deferReply({ flags: [64] });

            const pilotId = interaction.fields.getTextInputValue("pilot_id").trim();
            const departureTime = interaction.fields.getTextInputValue("departure_time").trim();

            await pointsManager.addPoint(interaction.user.id);

            const channel = interaction.guild.channels.cache.get(OPEN_GAME_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                const container = new ContainerBuilder()
                    .addTextDisplayComponents(text => text.setContent('# **<:BC:1394417506956873882>  | 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗔𝗜𝗥𝗣𝗢𝗥𝗧 .**'))
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(text => text.setContent(
`-# **Welcome to the official Bright Town Airport . The next scheduled flight is now preparing for departure . All passengers are kindly requested to reserve their seat , complete the boarding process , and remain ready until take-off is announced by the flight crew .**

**<:BC89:1408079073581994115> | Pilot ID : ( ${pilotId} ) .**

**<:BC89:1408079073581994115> | Departure Time : ( ${departureTime} ) .**

**<:Warning:1394997423335800883> | Flight Instructions :**

-# **( 1 ) — Please make sure you have added the host before boarding the flight .**

-# **( 2 ) — Ensure your internet connection is stable to avoid disconnecting during travel .**

-# **( 3 ) — Review all server rules and roleplay regulations before joining the session .**

-# **( 4 ) — If you experience any rule violation during the trip , contact the supervision team instead of arguing in-game .**

-# **( 5 ) — Follow all pilot instructions until the flight has safely reached its destination .**

-# **( 6 ) — Respect all passengers and maintain proper roleplay behavior throughout the journey .**


**<:emoji_230:1394415193949343795>  | Bright Town Airport Management .**

-# \` # \` **For : @everyone - @here**`
                    ))
                    .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                    .addTextDisplayComponents(text => text.setContent('-# **Bright Town RP © All Rights Reserved .**'))
                    .setAccentColor(0x2f3136);

                await channel.send({
                    flags: MessageFlags.IsComponentsV2,
                    components: [container],
                });

                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: "<a:34:1396338093841191012> | تم ارسال الرحلة بنجاح وإضافة نقطة لك" });
        }

        if (interaction.customId === "alert_modal") {
            await interaction.deferReply({ flags: [64] });

            const notice = interaction.fields.getTextInputValue("important_notice").trim();

            const channel = interaction.guild.channels.cache.get(JOIN_ALERT_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setDescription(
`# **<:Warning:1394997423335800883> | 𝗕𝗿𝗶𝗴𝗵𝘁 𝗧𝗼𝘄𝗻 𝗔𝗹𝗲𝗿𝘁   .**

-# **This is an official server announcement . Please read the information below carefully and follow all instructions provided by the administration team .**

**<:WT:1526547334236737597> | Important Notice :  ( ${notice} )**

-# **( 1 ) — Please follow all server rules and roleplay regulations at all times .**

-# **( 2 ) — Respect all players and maintain a friendly and professional environment .**

-# **( 3 ) — Do not engage in toxic behavior , harassment , or unnecessary arguments .**
-# **( 4 ) — Any violation of the server rules may result in warnings , timeouts , or other administrative actions .**

-# **( 5 ) — If you encounter any issues or witness a rule violation , please contact the staff team immediately .**

-# **( 6 ) — Stay updated by checking the announcement channels regularly for the latest news and important updates .**

-# **( 7 ) — Thank you for your cooperation and for helping us maintain a safe , enjoyable , and professional roleplay community .**

-# \`#\` **For : @everyone - @here**
-# **Bright Town RP © All Rights Reserved .**`
                    );

                await channel.send({ embeds: [embed] });
                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: "<a:34:1396338093841191012> | تم نشر التنبيه بنجاح" });
        }
    }
};