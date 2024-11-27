import { Client, TextChannel, EmbedBuilder } from "discord.js";
import { CHANNELS } from "../configuration/channels";

export const sendLog = async (client: Client, eventType: keyof typeof CHANNELS, embed: EmbedBuilder) => {
    const channelId = CHANNELS[eventType];
    const channel = client.channels.cache.get(channelId) as TextChannel;

    if (!channel) {
        console.error(`Канал для события ${eventType} не найден.`);
        return;
    }

    await channel.send({ embeds: [embed]});
}