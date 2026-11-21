const { EmbedBuilder } = require("discord.js");

const REQUEST_CHANNEL = "1527755985928720516";
const lineUrl = "https://i.imgur.com/SMYCROp.jpg";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId !== "points_request_modal") return;

        await interaction.deferReply({ flags: [64] });

        const amount = interaction.fields.getTextInputValue("points_amount").trim();
        const task = interaction.fields.getTextInputValue("request_task").trim();
        const reason = interaction.fields.getStringSelectValues("request_reason")[0];

        const channel = interaction.guild.channels.cache.get(REQUEST_CHANNEL);
        if (channel) {
            await channel.send({ content: lineUrl });

            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setTitle("**<:BC:1408079616081399968> | 𝗔𝗱𝗺𝗶𝗻 𝗣𝗼𝗶𝗻𝘁𝘀 𝗥𝗲𝗾𝘂𝗲𝘀𝘁 .**")
                .setDescription(
`-# **Please complete the request below to claim your administrative points . Ensure that all submitted information is accurate before sending your request for review .**

** <:BC89:1408079073581994115>  | 𝗔𝗱𝗺𝗶𝗻 : ( <@${interaction.user.id}> ) .**

**<:BC89:1408079073581994115> | Requested Points : ( \`${amount}\` ) .**

**<:BC89:1408079073581994115> | Task : ( \`${task}\` ) .**

**<:BC89:1408079073581994115>  | Reason : ( \`${reason}\` ) .**

**<:emoji_236:1395599624898609212> | Important Notes :**
-# **( 1 ) — Requests with incomplete or incorrect information may be rejected .**
-# **( 2 ) — Administrative points are awarded only for approved duties and completed tasks .**
-# **( 3 ) — All requests are reviewed by senior administration before approval .**
-# **( 4 ) — Submitting false information may result in your request being denied .**

-# **Bright Town Management © All Rights Reserved .**`
                );

            await channel.send({ embeds: [embed] });
            await channel.send({ content: lineUrl });
        }

        return interaction.editReply({ content: ":white_check_mark: | تم إرسال طلبك بنجاح" });
    }
};