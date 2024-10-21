import { TextChannel, type Embed, type MessagePayload } from "discord.js";
import { container } from '@sapphire/framework';
import { MessageBuilder } from "@sapphire/discord.js-utilities";
import { getAlertEmbed } from "./embeds.js";

export function sendAlert(channelId: string, message: string) {
    const channel = container.client.channels.cache.get(channelId);
    if (!channel || !(channel instanceof TextChannel)) return;
    let messageBuilder = new MessageBuilder()
    .setEmbeds([getAlertEmbed(message)]);
    channel.send(messageBuilder);
}