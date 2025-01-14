import { EmbedBuilder, ForumChannel, Message, TextChannel, ThreadChannel, type Embed, type MessagePayload, type TextBasedChannel } from "discord.js";
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

export async function sendEmbed(channelId: string, embedBuilder: EmbedBuilder, threadId?: string) {
    let channel = container.client.channels.cache.get(channelId);
    if (!(channel instanceof TextChannel || channel instanceof ForumChannel)) return;
    if (!channel) return;
    if (threadId) {
        channel = await channel.threads.fetch(threadId) || undefined;
    }
    if (!channel || !(channel instanceof TextChannel || channel instanceof ThreadChannel)) return;
    let messageBuilder = new MessageBuilder()
    .setEmbeds([embedBuilder]);
    return await channel.send(messageBuilder);
}

export async function validateMessage(channel: TextBasedChannel, messageId: string): Promise<Message> {
    const message = await channel.messages.fetch(messageId);

    if (!message) {
        throw new Error('Message not found. Please provide a valid message ID.');
    }

    if (!message.editable) {
        throw new Error('This message cannot be edited.');
    }

    return message;
}

export function parseMessageLink(link: string): { guildId: string; channelId: string; messageId: string } | null {
    const regex = /https:\/\/discord\.com\/channels\/(\d+)\/(\d+)\/(\d+)/;
    const match = link.match(regex);

    if (!match) return null;

    const [, guildId, channelId, messageId] = match;

    if (!guildId || !channelId || !messageId) return null;

    return { guildId, channelId, messageId };
}
