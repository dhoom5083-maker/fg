const {
    ActionRowBuilder,
    AttachmentBuilder,
    ButtonBuilder,
    ButtonStyle,
    ContainerBuilder,
    MediaGalleryItemBuilder,
    MessageFlags,
    SeparatorSpacingSize,
    StringSelectMenuBuilder
} = require("discord.js");
const { APPS, ITEMS, STATIONS } = require("../../config/phone");
const { stretch, fit } = require("./text");

const FILE = "phone-view.png";

function payload(png, container, ephemeral) {
    const flags = ephemeral
        ? [MessageFlags.IsComponentsV2, MessageFlags.Ephemeral]
        : MessageFlags.IsComponentsV2;
    return {
        flags,
        files: [new AttachmentBuilder(png, { name: FILE })],
        components: [container]
    };
}

function frame(title, body, rows) {
    const container = new ContainerBuilder()
        .setAccentColor(0x2f3136)
        .addTextDisplayComponents((text) => text.setContent(`# ${title}`))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
        .addTextDisplayComponents((text) => text.setContent(body))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
        .addMediaGalleryComponents((media) => media.addItems(
            new MediaGalleryItemBuilder().setURL(`attachment://${FILE}`)
        ))
        .addSeparatorComponents((sep) => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large));

    rows.forEach((row) => container.addActionRowComponents(row));
    return container;
}

function homeRow() {
    const menu = new StringSelectMenuBuilder()
        .setCustomId("phone_app")
        .setPlaceholder(fit("اختر التطبيق", 150))
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(APPS.map((app) => ({
            label: fit(app.name, 100),
            value: app.id,
            description: fit(app.hint, 100)
        })));
    return new ActionRowBuilder().addComponents(menu);
}

function button(id, name) {
    return new ButtonBuilder()
        .setCustomId(id)
        .setLabel(fit(name, 80))
        .setStyle(ButtonStyle.Secondary);
}

function homeIntro() {
    return stretch("الو كيف حالك. هذا جوال برايت تاون الحصري. فيه بنك وخريطة وكاميرا ولايف انفيدر وراديو ومتجر وطوارئ وهوية، والاستبيان كله بحرف مطول. اختر التطبيق من القائمة.");
}

function homePayload(png) {
    const container = frame("BTRP ™", homeIntro(), [homeRow()]);
    return payload(png, container, false);
}

function appPayload(appId, png, body, ephemeral) {
    const app = APPS.find((entry) => entry.id === appId);
    const rows = [];

    if (appId === "bank") {
        rows.push(new ActionRowBuilder().addComponents(
            button("phone_bank_transfer", "تحويل"),
            button("phone_bank_daily", "مكافأة")
        ));
    } else if (appId === "chat") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_msg_send", "إرسال")));
    } else if (appId === "feed") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_post_send", "نشر")));
    } else if (appId === "contacts") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_contact_add", "إضافة")));
    } else if (appId === "notes") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_note_save", "حفظ")));
    } else if (appId === "radio") {
        rows.push(new ActionRowBuilder().addComponents(
            ...STATIONS.map((station) => button(`phone_radio_${station.id}`, station.name))
        ));
    } else if (appId === "camera") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_camera", "التقط")));
    } else if (appId === "store") {
        const menu = new StringSelectMenuBuilder()
            .setCustomId("phone_store")
            .setPlaceholder(fit("اختر غرض", 150))
            .addOptions(ITEMS.map((item) => ({
                label: fit(item.name, 100),
                value: item.id,
                description: fit(`${item.price} دولار`, 100)
            })));
        rows.push(new ActionRowBuilder().addComponents(menu));
    } else if (appId === "sos") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_sos_open", "بلاغ")));
    } else if (appId === "survey") {
        rows.push(new ActionRowBuilder().addComponents(button("phone_survey_open", "الاستبيان")));
    }

    const container = frame(stretch(app ? app.name : "جوال"), body, rows);
    return payload(png, container, ephemeral);
}

function surveyLines(survey) {
    if (!survey) {
        return stretch("الو كيف حالك. الاستبيان لسا فاضي. اضغط الزر وجاوب، والكلام يطلع بحرف مطول.");
    }
    return [
        stretch("الو كيف حالك"),
        `${stretch("كيف حالك")}: ${survey.mood}`,
        `${stretch("اسم شخصيتك")}: ${survey.character}`,
        `${stretch("عمرك بالمدينة")}: ${survey.cityAge}`,
        `${stretch("وش تبي نطور")}: ${survey.improve}`,
        `${stretch("تقييمك من عشرة")}: ${survey.rating}`
    ].join("\n");
}

module.exports = { homePayload, appPayload, surveyLines, stretch, fit };
