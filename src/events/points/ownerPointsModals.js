const { EmbedBuilder } = require("discord.js");
const pointsDB = require("../../services/pointsManager");

const LOG_CHANNEL = "1527377945151144026";
const lineUrl = "https://i.imgur.com/SMYCROp.jpg";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isModalSubmit()) return;

        if (interaction.customId === "remove_points_modal") {
            await interaction.deferReply({ flags: [64] });

            const username = interaction.fields.getTextInputValue("admin_username").trim();
            const amount = parseInt(interaction.fields.getTextInputValue("points_amount").trim());

            if (isNaN(amount)) {
                return interaction.editReply({ content: ":x: | عدد النقاط يجب أن يكون رقم" });
            }

            await interaction.guild.members.fetch();
            const target = interaction.guild.members.cache.find(m => m.user.username.toLowerCase() === username.toLowerCase());

            if (!target) {
                return interaction.editReply({ content: ":x: | ما قدرت ألقى عضو بهذا اليوزر" });
            }

            const newTotal = await pointsDB.removePoints(target.id, amount);
            const actualDeducted = amount;

            const channel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("**<:emoji_294:1406517910310096956> | 𝗔𝗱𝗺𝗶𝗻 𝗣𝗼𝗶𝗻𝘁𝘀 𝗗𝗲𝗱𝘂𝗰𝘁𝗶𝗼𝗻 .**")
                    .setDescription(
`-# **An administrative points deduction has been successfully processed and recorded in the management system .**

**<:BC89:1408079073581994115>  | 𝗔𝗱𝗺𝗶𝗻 : ( <@${target.id}> ) .**

**<:BC89:1408079073581994115>  | Processed By : ( <@${interaction.user.id}> ) .**

**<:BC89:1408079073581994115> | Points Deducted : ( \`${actualDeducted}\` ) .**

**<:emoji_236:1395599624898609212> | Administrative Notice :**
-# **( 1 ) — This deduction has been applied in accordance with the server's administrative policies .**
-# **( 2 ) — All point transactions are permanently logged for transparency and future review .**
-# **( 3 ) — Staff members are expected to maintain professional conduct and complete their assigned responsibilities .**
-# **( 4 ) — If you believe this deduction was made in error , please contact senior management for further review .**

-# **Bright Town Management © All Rights Reserved .**`
                    );

                await channel.send({ embeds: [embed] });
                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: `:white_check_mark: | تم خصم النقاط بنجاح — النقاط الحالي: ${newTotal}` });
        }

        if (interaction.customId === "add_points_modal") {
            await interaction.deferReply({ flags: [64] });

            const username = interaction.fields.getTextInputValue("admin_username").trim();
            const amount = parseInt(interaction.fields.getTextInputValue("points_amount").trim());

            if (isNaN(amount)) {
                return interaction.editReply({ content: ":x: | عدد النقاط يجب أن يكون رقم" });
            }

            await interaction.guild.members.fetch();
            const target = interaction.guild.members.cache.find(m => m.user.username.toLowerCase() === username.toLowerCase());

            if (!target) {
                return interaction.editReply({ content: ":x: | ما قدرت ألقى عضو بهذا اليوزر" });
            }

            const newTotal = await pointsDB.addPoints(target.id, amount);

            const channel = interaction.guild.channels.cache.get(LOG_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                const embed = new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("**<:emoji_294:1406517910310096956> | 𝗔𝗱𝗺𝗶𝗻 𝗣𝗼𝗶𝗻𝘁𝘀 𝗔𝗱𝗱𝗲𝗱  .**")
                    .setDescription(
`-# **An administrative points deduction has been successfully processed and recorded in the management system .**

**<:BC89:1408079073581994115>  | 𝗔𝗱𝗺𝗶𝗻 : ( <@${target.id}> ) .**

**<:BC89:1408079073581994115>  | Processed By : ( <@${interaction.user.id}> ) .**

**<:BC89:1408079073581994115> | Points 𝗔𝗱𝗱𝗲𝗱 : ( \`${amount}\` ) .**

**<:emoji_236:1395599624898609212> | Administrative Notice :**
-# **( 1 ) — This deduction has been applied in accordance with the server's administrative policies .**
-# **( 2 ) — All point transactions are permanently logged for transparency and future review .**
-# **( 3 ) — Staff members are expected to maintain professional conduct and complete their assigned responsibilities .**
-# **( 4 ) — If you believe this deduction was made in error , please contact senior management for further review .**

-# **Bright Town Management © All Rights Reserved .**`
                    );

                await channel.send({ embeds: [embed] });
                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: `:white_check_mark: | تم إضافة النقاط بنجاح — النقاط الحالي: ${newTotal}` });
        }
    }
};