const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

function buildSupervisionPanel(loggedInUserIds) {
    const ids = Array.isArray(loggedInUserIds) ? loggedInUserIds : (loggedInUserIds ? [loggedInUserIds] : []);
    const mentionLine = ids.length > 0
        ? ids.map(id => `<@${id}> <:BT:1394414895751233737> | Log in`).join('\n')
        : '-';

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("supervision_request")
            .setLabel("|  طـلـب رقـابـي")
            .setEmoji("1408079616081399968")
            .setStyle(ButtonStyle.Secondary)
    );

    const container = new ContainerBuilder()
        .addTextDisplayComponents(text => text.setContent('# BTRP'))
        .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
        .addTextDisplayComponents(text => text.setContent(mentionLine))
        .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
        .addTextDisplayComponents(text => text.setContent(
`> Welcome to the official **Supervision Request Panel** .

**This panel allows you to submit an official supervision request whenever you require the presence or assistance of an available supervisor . Every request is reviewed carefully to ensure that it is handled fairly , professionally , and as quickly as possible .

Before submitting your request , please ensure that all information you provide is accurate and clearly explains your situation . Detailed requests help supervisors understand the circumstances and provide the appropriate assistance without unnecessary delays .

Once your request has been submitted , it will be placed in the supervision queue until a supervisor becomes available . Please remain patient and avoid submitting multiple requests for the same situation while your current request is still under review .

Thank you for helping us maintain an organised and efficient supervision system . Your cooperation allows our staff team to provide faster responses and a better experience for everyone .**`
        ))
        .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
        .addActionRowComponents(row)
        .setAccentColor(0x2f3136);

    return { flags: MessageFlags.IsComponentsV2, components: [container] };
}

module.exports = { buildSupervisionPanel };