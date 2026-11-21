module.exports = {
    voiceChannelId: process.env.VOICE_CHANNEL_ID || "1527377620579127437",
    reactionMessageId: process.env.REACTION_MESSAGE_ID || "1527463154315956366",
    reactionRoleId: process.env.REACTION_ROLE_ID || "1527377192059670772",
    autoLineUrl: process.env.AUTO_LINE_URL || "https://cdn.discordapp.com/attachments/1525871801584848967/1527400202187702362/Picsart_26-07-16_14-15-09-567.jpg?ex=6a5a85c9&is=6a593449&hm=5a3e35df379457a28363df07e3a42403cb3d6cb73d801199a26a56bc24c327b6&",
    welcome: {
        lineUrl: "https://cdn.discordapp.com/attachments/1525491050167140433/1525970227769114664/BF20BBE8-3981-4D10-BB25-A6AC57C54152.jpg?ex=6a574c45&is=6a55fac5&hm=439584d08599a84fee145edd1f8bea21c8b8a52c5c4597bf13aaa3e8992e7dc7&",
        rulesChannelId: process.env.WELCOME_RULES_CHANNEL_ID || "",
        verifyChannelId: process.env.WELCOME_VERIFY_CHANNEL_ID || ""
    },
    presence: {
        name: process.env.PRESENCE_NAME || "- Work For bright town  .",
        url: process.env.PRESENCE_URL || "https://www.twitch.tv/twitch"
    },
    phoneEmergencyChannelId: process.env.PHONE_EMERGENCY_CHANNEL_ID || ""
};
