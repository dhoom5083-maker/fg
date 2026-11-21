const {
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

const REQUEST_CHANNEL = "1532148001878048828";
const lineUrl = "https://cdn.discordapp.com/attachments/1525871801584848967/1527400202187702362/Picsart_26-07-16_14-15-09-567.jpg?ex=6a5a85c9&is=6a593449&hm=5a3e35df379457a28363df07e3a42403cb3d6cb73d801199a26a56bc24c327b6&";

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {

        if (interaction.isButton() && interaction.customId === "supervision_request") {
            const modal = new ModalBuilder()
                .setCustomId("supervision_request_modal")
                .setTitle("طلب رقابي");

            const topicInput = new TextInputBuilder()
                .setCustomId("topic")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true);

            const topicLabel = new LabelBuilder()
                .setLabel("الـمـوضـوع  ( بـتـفـصـيـل )")
                .setTextInputComponent(topicInput);

            const idInput = new TextInputBuilder()
                .setCustomId("player_id")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const idLabel = new LabelBuilder()
                .setLabel("ايـديـك ( داخل قراند )")
                .setTextInputComponent(idInput);

            const evidenceInput = new TextInputBuilder()
                .setCustomId("evidence")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            const evidenceLabel = new LabelBuilder()
                .setLabel("ادلـة  :")
                .setTextInputComponent(evidenceInput);

            modal.addLabelComponents(topicLabel, idLabel, evidenceLabel);

            return interaction.showModal(modal);
        }

        if (interaction.isModalSubmit() && interaction.customId === "supervision_request_modal") {
            await interaction.deferReply({ flags: [64] });

            const topic = interaction.fields.getTextInputValue("topic").trim();
            const playerId = interaction.fields.getTextInputValue("player_id").trim();
            const evidence = interaction.fields.getTextInputValue("evidence")?.trim();

            const channel = interaction.guild.channels.cache.get(REQUEST_CHANNEL);
            if (channel) {
                await channel.send({ content: lineUrl });

                let content =
`**طـلـب رقـابـي |  <:BC:1406543376450326548>

<:BC89:1408079073581994115> - الـعـضـو  | <@${interaction.user.id}>

<:BC89:1408079073581994115> - الـمـوضـوع  | ${topic}
<:BC89:1408079073581994115> - ايـدي الـشـخـص  | ${playerId}**`;

                if (evidence) {
                    content += `\n\n${evidence}`;
                }

                await channel.send({ content });
                await channel.send({ content: lineUrl });
            }

            return interaction.editReply({ content: "<:BT:1394416095254941747> | تم إرسال طلبك بنجاح" });
        }
    }
};