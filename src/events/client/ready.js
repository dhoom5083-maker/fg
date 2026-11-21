const { ActivityType } = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const { voiceChannelId, presence } = require("../../config/ids");
const log = require("../../utils/logger");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        log.info("bot", `online as ${client.user.tag}`);

        client.user.setPresence({
            activities: [{
                name: presence.name,
                type: ActivityType.Streaming,
                url: presence.url
            }],
            status: "online"
        });

        const channel = await client.channels.fetch(voiceChannelId).catch(() => null);
        if (!channel || !channel.isVoiceBased()) return;

        joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false
        });
    }
};
