const { reactionMessageId, reactionRoleId } = require("../../config/ids");

module.exports = {
    name: "messageReactionAdd",
    async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.message.id !== reactionMessageId) return;

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error(error);
                return;
            }
        }

        const guild = reaction.message.guild;
        if (!guild) return;

        try {
            const member = await guild.members.fetch(user.id);
            const role = guild.roles.cache.get(reactionRoleId);
            if (member && role) await member.roles.add(role);
        } catch (error) {
            console.error(error);
        }
    }
};
