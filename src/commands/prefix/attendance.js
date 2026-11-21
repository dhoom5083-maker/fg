const {
    MessageFlags,
    ContainerBuilder,
    SeparatorSpacingSize,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const ADMIN_STREET_ROLE = "1527377019149619211";
const lineUrl = "https://cdn.discordapp.com/attachments/1525871801584848967/1527400202187702362/Picsart_26-07-16_14-15-09-567.jpg?ex=6a6b0089&is=6a69af09&hm=7124149a00f8b73380391f2ed11b3b155aaa94226911c81df22bc1cae694906e&";

module.exports = {
    name: "p12",
    async execute(message, args, client) {
        if (!message.member.roles.cache.has(ADMIN_STREET_ROLE)) return;

        try {
            await message.delete();
        } catch (error) {
            console.error(error);
        }

        try {
            await message.channel.send({ content: lineUrl });

            const rowLogin = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("attendance_login")
                    .setLabel("| Log in")
                    .setEmoji("1394414895751233737")
                    .setStyle(ButtonStyle.Success)
            );

            const rowLogout = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("attendance_logout")
                    .setLabel("| Log out")
                    .setEmoji("1394414989703516352")
                    .setStyle(ButtonStyle.Danger)
            );

            const container = new ContainerBuilder()
                .addTextDisplayComponents(text => text.setContent('# Control Panel'))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent(
`-# **Welcome to the official Attendance Control Panel . This system has been developed to provide a professional and organised method for recording staff attendance , monitoring duty status , and maintaining accurate attendance records throughout every working shift .**

-# **Every attendance action is securely recorded within the management system to ensure reliable tracking of staff activity . By registering your attendance correctly , you help maintain an organised workflow and provide management with accurate information regarding staff availability and daily operations .**

-# **Please remember to update your attendance whenever you begin or finish your duty . Failure to record your attendance correctly may result in inaccurate activity records and could affect the monitoring of your working hours and staff availability .**

### **<:BT:1406542487715053620> | Attendance Options  :  **

**<:BT:1394414895751233737> | Log in**

**<:BT:1394414989703516352> | Log out**

### **<:emoji_244:1406543775412650045> | Attendance Guidelines**

> • Always register your attendance before performing any staff duties .
>
> • Do not remain on duty if you are unavailable or away from your workstation .
>
> • Ensure your attendance status accurately reflects your current availability at all times .
>
> • Attendance records are reviewed by management and may be used for activity evaluations and administrative reports .
>
> • If you experience any issues while registering your attendance , please contact the management team for assistance .

-# **Thank you for helping us maintain a professional , organised , and reliable management environment . Your cooperation ensures accurate attendance records and contributes to the efficiency of the entire staff team .**`
                ))
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addActionRowComponents(rowLogin)
                .addActionRowComponents(rowLogout)
                .addSeparatorComponents(sep => sep.setDivider(true).setSpacing(SeparatorSpacingSize.Large))
                .addTextDisplayComponents(text => text.setContent('-# **Bright Town Management System © All Rights Reserved**'))
                .setAccentColor(0x2f3136);

            await message.channel.send({
                flags: MessageFlags.IsComponentsV2,
                components: [container],
            });

            await message.channel.send({ content: lineUrl });
        } catch (error) {
            console.error(error);
        }
    }
};