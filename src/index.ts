require('dotenv/config')
import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!BOT_TOKEN) {
    throw new Error("Токен для бота не найден. Убедитесь в его наличии в .env файле.");
}

client.once("ready", () => {
    console.log(`Бот успешно запущен как ${client.user?.tag}!`);
});

client.on("messageCreate", (message) => {

    if (message.author.bot) return;


    if (message.content === "!ping") {
        message.channel.send("Pong!");
    }

    if (message.content === "!hello") {
        message.channel.send(`Привет, ${message.author.username}!`);
    }
});


client.login(BOT_TOKEN).catch((err) => {
    console.error("Ошибка запуска бота:", err);
});