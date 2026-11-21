const {
    ModalBuilder,
    LabelBuilder,
    TextInputBuilder,
    TextInputStyle
} = require("discord.js");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction, client) => {
        if (!interaction.isStringSelectMenu()) return;
        if (interaction.customId !== "owner_points_menu") return;

        const value = interaction.values[0];

        if (value === "add_points") {
            const modal = new ModalBuilder()
                .setCustomId("add_points_modal")
                .setTitle("إضافة نقاط");

            const usernameInput = new TextInputBuilder()
                .setCustomId("admin_username")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const usernameLabel = new LabelBuilder()
                .setLabel("يوزر الاداري")
                .setTextInputComponent(usernameInput);

            const amountInput = new TextInputBuilder()
                .setCustomId("points_amount")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const amountLabel = new LabelBuilder()
                .setLabel("عدد النقاط")
                .setTextInputComponent(amountInput);

            modal.addLabelComponents(usernameLabel, amountLabel);

            return interaction.showModal(modal);
        }

        if (value === "remove_points") {
            const modal = new ModalBuilder()
                .setCustomId("remove_points_modal")
                .setTitle("خصم نقاط");

            const usernameInput = new TextInputBuilder()
                .setCustomId("admin_username")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const usernameLabel = new LabelBuilder()
                .setLabel("يوزر الاداري")
                .setTextInputComponent(usernameInput);

            const amountInput = new TextInputBuilder()
                .setCustomId("points_amount")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const amountLabel = new LabelBuilder()
                .setLabel("عدد النقاط")
                .setTextInputComponent(amountInput);

            modal.addLabelComponents(usernameLabel, amountLabel);

            return interaction.showModal(modal);
        }
    }
};