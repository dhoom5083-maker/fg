require("dotenv").config();

const { Client, GatewayIntentBits, Collection, Partials } = require("discord.js");
const { connectMongo } = require("./config/mongo");
const log = require("./utils/logger");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.setMaxListeners(40);
client.commands = new Collection();
client.slashCommands = new Collection();
client.config = {
    token: process.env.BOT_TOKEN,
    prefix: process.env.PREFIX || "-"
};

if (!client.config.token) {
    log.error("bot", "BOT_TOKEN is missing");
    process.exit(1);
}

require("./loaders/commands")(client);
require("./loaders/events")(client);

process.on("unhandledRejection", (error) => {
    log.error("process", error && error.stack ? error.stack : String(error));
});

(async () => {
    await connectMongo();
    await client.login(client.config.token);
})().catch((error) => {
    log.error("bot", error.message);
    process.exit(1);
});
