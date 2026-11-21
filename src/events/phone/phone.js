const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    MessageFlags
} = require("discord.js");
const store = require("../../services/phoneStore");
const { render } = require("../../ui/phone/canvas");
const { appPayload, surveyLines, stretch, fit } = require("../../ui/phone/panel");
const { STATIONS } = require("../../config/phone");
const ids = require("../../config/ids");

function modalInput(id, label, style, max) {
    return new ActionRowBuilder().addComponents(
        new TextInputBuilder()
            .setCustomId(id)
            .setLabel(fit(label, 45))
            .setStyle(style)
            .setRequired(true)
            .setMaxLength(max)
    );
}

function openModal(interaction, customId, title, rows) {
    const modal = new ModalBuilder().setCustomId(customId).setTitle(fit(title, 45));
    rows.forEach((row) => modal.addComponents(row));
    return interaction.showModal(modal);
}

async function fail(interaction, reason) {
    const payload = { content: stretch(reason), flags: MessageFlags.Ephemeral };
    if (interaction.deferred || interaction.replied) return interaction.followUp(payload);
    return interaction.reply(payload);
}

async function show(interaction, appId, png, body, update) {
    const message = appPayload(appId, png, body, !update);
    if (update) {
        message.flags = MessageFlags.IsComponentsV2;
        return interaction.update(message);
    }
    return interaction.reply(message);
}

async function screen(interaction, appId, extra, update) {
    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    const name = interaction.member?.displayName || interaction.user.username;
    const account = await store.getAccount(userId, guildId);
    let body = stretch("تم");
    let png;

    if (appId === "bank") {
        body = stretch(`رصيدك ${account.balance}. رقمك ${account.phone}. حول أو خذ المكافأة اليومية.`);
        png = render("bank", { account });
    } else if (appId === "chat") {
        const messages = await store.recentMessages(userId, guildId);
        body = messages.length
            ? messages.map((entry) => `${entry.fromId === userId ? stretch("صادر") : stretch("وارد")}: ${entry.body}`).join("\n")
            : stretch("ما فيه رسائل. أرسل برقم الجوال أو الآيدي.");
        png = render("chat", { messages, userId });
    } else if (appId === "map") {
        body = stretch("خريطة برايت تاون. الوسط والميناء والشمال والمطار والصناعية.");
        png = render("map");
    } else if (appId === "camera") {
        body = stretch("كاميرا المدينة. كل لقطة تتغير.");
        png = render("camera", { name, seed: extra?.seed || account.shots || 1 });
    } else if (appId === "feed") {
        const posts = await store.recentPosts(guildId);
        body = posts.length
            ? posts.map((post) => post.body).join("\n")
            : stretch("لايف انفيدر فاضي. انشر أول نبض.");
        png = render("feed", { posts });
    } else if (appId === "contacts") {
        body = account.contacts.length
            ? account.contacts.map((contact) => `${contact.name} ${contact.phone}`).join("\n")
            : stretch("جهاتك فاضية.");
        png = render("contacts", { account });
    } else if (appId === "notes") {
        body = account.notes ? account.notes : stretch("اكتب ملاحظة وتبقى على جوالك.");
        png = render("notes", { account });
    } else if (appId === "radio") {
        const station = STATIONS.find((entry) => entry.id === (extra?.station || account.radio)) || STATIONS[0];
        body = stretch(`المحطة ${station.name}. ${station.track}`);
        png = render("radio", { station: station.id });
    } else if (appId === "weather") {
        body = stretch("طقس برايت تاون اليوم. الشاشة تتحدث مع تاريخ المدينة.");
        png = render("weather");
    } else if (appId === "store") {
        body = stretch("متجر حصري. الشريحة الذهب ومفتاح الكراج والكاميرا والراديو ونظارة الليل.");
        png = render("store", { account });
    } else if (appId === "sos") {
        body = stretch("اكتب البلاغ باختصار. إذا حطيت قناة الطوارئ بالبيئة يوصل للإدارة.");
        png = render("sos");
    } else if (appId === "survey") {
        const survey = extra?.survey || await store.latestSurvey(userId, guildId);
        body = surveyLines(survey);
        png = render("survey", { survey });
    } else if (appId === "id") {
        body = stretch(`هويتك الرقمية. الاسم ${name}. الرقم ${account.phone}.`);
        png = render("id", { account, name });
    } else {
        png = render("home");
    }

    return show(interaction, appId, png, body, update);
}

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        const customId = interaction.customId || "";
        if (!customId.startsWith("phone_")) return;
        if (!interaction.guildId) return;

        try {
            if (interaction.isStringSelectMenu() && customId === "phone_app") {
                await screen(interaction, interaction.values[0], null, false);
                return;
            }

            if (interaction.isStringSelectMenu() && customId === "phone_store") {
                const result = await store.buy(interaction.user.id, interaction.guildId, interaction.values[0]);
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "store", null, true);
                return;
            }

            if (interaction.isButton() && customId === "phone_bank_transfer") {
                await openModal(interaction, "phone_modal_transfer", "تحويل", [
                    modalInput("phone_to", "الرقم أو الآيدي", TextInputStyle.Short, 30),
                    modalInput("phone_amount", "المبلغ", TextInputStyle.Short, 8)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_bank_daily") {
                const result = await store.daily(interaction.user.id, interaction.guildId);
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "bank", null, true);
                return;
            }

            if (interaction.isButton() && customId === "phone_msg_send") {
                await openModal(interaction, "phone_modal_message", "رسالة", [
                    modalInput("phone_to", "الرقم أو الآيدي", TextInputStyle.Short, 30),
                    modalInput("phone_body", "نص الرسالة", TextInputStyle.Paragraph, 280)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_post_send") {
                await openModal(interaction, "phone_modal_post", "منشور", [
                    modalInput("phone_body", "وش تبي تقول", TextInputStyle.Paragraph, 280)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_note_save") {
                await openModal(interaction, "phone_modal_note", "ملاحظة", [
                    modalInput("phone_body", "الملاحظة", TextInputStyle.Paragraph, 300)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_contact_add") {
                await openModal(interaction, "phone_modal_contact", "جهة", [
                    modalInput("phone_name", "الاسم", TextInputStyle.Short, 32),
                    modalInput("phone_number", "الرقم", TextInputStyle.Short, 20)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_survey_open") {
                await openModal(interaction, "phone_modal_survey", "استبيان الجوال", [
                    modalInput("mood", "كيف حالك", TextInputStyle.Short, 80),
                    modalInput("character", "اسم شخصيتك", TextInputStyle.Short, 40),
                    modalInput("cityAge", "عمرك بالمدينة", TextInputStyle.Short, 40),
                    modalInput("improve", "وش تبي نطور", TextInputStyle.Paragraph, 300),
                    modalInput("rating", "تقييمك من عشرة", TextInputStyle.Short, 20)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_sos_open") {
                await openModal(interaction, "phone_modal_sos", "بلاغ", [
                    modalInput("phone_body", "تفاصيل البلاغ", TextInputStyle.Paragraph, 300)
                ]);
                return;
            }

            if (interaction.isButton() && customId === "phone_camera") {
                const account = await store.snap(interaction.user.id, interaction.guildId);
                await screen(interaction, "camera", { seed: account.shots }, true);
                return;
            }

            if (interaction.isButton() && customId.startsWith("phone_radio_")) {
                const station = customId.slice("phone_radio_".length);
                await store.setRadio(interaction.user.id, interaction.guildId, station);
                await screen(interaction, "radio", { station }, true);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_transfer") {
                const result = await store.transfer(
                    interaction.user.id,
                    interaction.guildId,
                    interaction.fields.getTextInputValue("phone_to"),
                    interaction.fields.getTextInputValue("phone_amount")
                );
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "bank", null, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_message") {
                const result = await store.sendMessage(
                    interaction.user.id,
                    interaction.guildId,
                    interaction.fields.getTextInputValue("phone_to"),
                    interaction.fields.getTextInputValue("phone_body")
                );
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "chat", null, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_post") {
                const result = await store.publish(
                    interaction.user.id,
                    interaction.guildId,
                    interaction.fields.getTextInputValue("phone_body")
                );
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "feed", null, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_note") {
                await store.saveNote(
                    interaction.user.id,
                    interaction.guildId,
                    interaction.fields.getTextInputValue("phone_body")
                );
                await screen(interaction, "notes", null, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_contact") {
                const result = await store.addContact(
                    interaction.user.id,
                    interaction.guildId,
                    interaction.fields.getTextInputValue("phone_name"),
                    interaction.fields.getTextInputValue("phone_number")
                );
                if (!result.ok) {
                    await fail(interaction, result.reason);
                    return;
                }
                await screen(interaction, "contacts", null, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_survey") {
                const survey = await store.saveSurvey(interaction.user.id, interaction.guildId, {
                    mood: interaction.fields.getTextInputValue("mood"),
                    character: interaction.fields.getTextInputValue("character"),
                    cityAge: interaction.fields.getTextInputValue("cityAge"),
                    improve: interaction.fields.getTextInputValue("improve"),
                    rating: interaction.fields.getTextInputValue("rating")
                });
                await screen(interaction, "survey", { survey }, false);
                return;
            }

            if (interaction.isModalSubmit() && customId === "phone_modal_sos") {
                const body = interaction.fields.getTextInputValue("phone_body").trim().slice(0, 300);
                const channelId = ids.phoneEmergencyChannelId;
                if (channelId) {
                    const channel = await interaction.client.channels.fetch(channelId).catch(() => null);
                    if (channel && channel.isTextBased()) {
                        await channel.send(`**بلاغ جوال**\n${interaction.user}\n${body}`);
                    }
                }
                await interaction.reply({
                    content: stretch("وصل بلاغك. خلك بمكان آمن"),
                    flags: MessageFlags.Ephemeral
                });
            }
        } catch (error) {
            console.error(error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: stretch("صار خطأ بالجوال"),
                    flags: MessageFlags.Ephemeral
                }).catch(() => null);
            }
        }
    }
};
