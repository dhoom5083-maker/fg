const {
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require('discord.js');

const ADMIN_STREET_ROLE = "1527377014007398530";
const PRISONER_ROLE = "1527377210741227590";
const LOG_CHANNEL = "1527377945151144026";
const lineUrl = 'https://i.imgur.com/SMYCROp.jpg';

module.exports = {
    name: 'interactionCreate',
    execute: async (interaction, client) => {
      try {

        if (interaction.isStringSelectMenu() && interaction.customId === "violators_menu") {
            const value = interaction.values[0];

            if (value === "imprison") {
                const modal = new ModalBuilder()
                    .setCustomId("imprison_modal")
                    .setTitle("سجن عضو");

                const usernameInput = new TextInputBuilder()
                    .setCustomId("target_username")
                    .setLabel("يـوزر الـعـضـو")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                const reasonInput = new TextInputBuilder()
                    .setCustomId("reason")
                    .setLabel("الـسـبـب")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(usernameInput),
                    new ActionRowBuilder().addComponents(reasonInput)
                );

                return interaction.showModal(modal);
            }

            if (value === "release") {
                const modal = new ModalBuilder()
                    .setCustomId("release_modal")
                    .setTitle("الإفراج عن عضو");

                const usernameInput = new TextInputBuilder()
                    .setCustomId("target_username")
                    .setLabel("يـوزر الـعـضـو")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true);

                modal.addComponents(
                    new ActionRowBuilder().addComponents(usernameInput)
                );

                return interaction.showModal(modal);
            }

            if (value === "records") {
                await interaction.deferReply({ flags: [64] });

                await interaction.guild.members.fetch();

                const admins = interaction.guild.members.cache.filter(m => m.roles.cache.has(ADMIN_STREET_ROLE));
                const prisoners = interaction.guild.members.cache.filter(m => m.roles.cache.has(PRISONER_ROLE));

                const adminsList = admins.size > 0
                    ? admins.map(m => `<@${m.id}>`).join("\n")
                    : "-";

                const prisonersList = prisoners.size > 0
                    ? prisoners.map(m => `<@${m.id}>`).join("\n")
                    : "-";

                const embed = new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(`**Prison officials:**\n${adminsList}\n\n**Prisoner record:**\n${prisonersList}**`);

                return interaction.editReply({ embeds: [embed] });
            }
        }

        if (interaction.isModalSubmit()) {

            if (interaction.customId === "imprison_modal") {
                await interaction.deferReply({ flags: [64] });

                const username = interaction.fields.getTextInputValue("target_username").trim();
                const reason = interaction.fields.getTextInputValue("reason").trim();

                await interaction.guild.members.fetch();
                const target = interaction.guild.members.cache.find(m => m.user.username.toLowerCase() === username.toLowerCase());

                if (!target) return interaction.editReply({
                    content: ":x: | ما قدرت ألقى عضو بهذا اليوزر"
                });

                await target.roles.add(PRISONER_ROLE).catch(() => null);

                const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("Black List System")
                        .setDescription(
`<:BC89:1408079073581994115>— المسؤول:  <@${interaction.user.id}>

<:Warning:1394997423335800883> – تم مخالفة العضو: <@${target.id}>

<a:BC:1408079473567338588> – بسبب: ${reason}

<a:lt51:1396338904423993436> – نتمنى لك يوما سعيدا.`
                        );

                    await logChannel.send({ embeds: [embed] });
                    await logChannel.send({ content: lineUrl });
                }

                return interaction.editReply({
                    content: ":white_check_mark: | تم تسجيل المخالفة بنجاح"
                });
            }

            if (interaction.customId === "release_modal") {
                await interaction.deferReply({ flags: [64] });

                const username = interaction.fields.getTextInputValue("target_username").trim();

                await interaction.guild.members.fetch();
                const target = interaction.guild.members.cache.find(m => m.user.username.toLowerCase() === username.toLowerCase());

                if (!target) return interaction.editReply({
                    content: ":x: | ما قدرت ألقى عضو بهذا اليوزر"
                });

                if (!target.roles.cache.has(PRISONER_ROLE)) {
                    return interaction.editReply({
                        content: "الـشـخـص مـو مـخـالـف"
                    });
                }

                await target.roles.remove(PRISONER_ROLE).catch(() => null);

                const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);
                if (logChannel) {
                    const embed = new EmbedBuilder()
                        .setColor("Red")
                        .setDescription(
`<:emoji_276:1526732130661568522> - Bright Town RP ™ .
لقد تم مُسامحة العضو <@${target.id}> ، وتم إستعادة رتبة و اسمه السابق .`
                        );

                    await logChannel.send({ embeds: [embed] });
                    await logChannel.send({ content: lineUrl });
                }

                return interaction.editReply({
                    content: ":white_check_mark: | تم الإفراج عن العضو بنجاح"
                });
            }
        }

      } catch (error) {
          console.error("violatorsInteractions error:", error);
          if (interaction.deferred || interaction.replied) {
              interaction.editReply({ content: ":x: | صار خطأ غير متوقع" }).catch(() => null);
          } else {
              interaction.reply({ content: ":x: | صار خطأ غير متوقع", flags: [64] }).catch(() => null);
          }
      }
    }
};