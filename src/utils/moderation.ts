import { EmbedBuilder, type User } from "discord.js";
import type { SnUser } from "../types/SnUser.js";
import { isBirthdayWithinTos } from "./dates.js";
import { ChannelId, ThreadId } from "../constants/channels.js";
import { sendAlert, sendEmbed } from "./messages.js";
import { getDiscordRelativeTime } from "./format.js";

export async function checkBirthdayIsWithinTos(snUser: SnUser, discordUser: User) : Promise<void> {
    if (snUser.socials.birthday == null) return;
    const withinTos = isBirthdayWithinTos(snUser.socials.birthday);

    const message = `Discord user <@${discordUser.id}> just linked SN user **${snUser.username}**, which has a birthday that would put them as being under 13 years old.`;

    if (!withinTos) sendAlert(ChannelId.ModTalk, message);
}

export async function logLinkEventToLinkingLog(snUser: SnUser, discordUser: User) : Promise<void> {

    let snString = snUser.stats.joinDate ? `account created ${getDiscordRelativeTime(snUser.stats.joinDate)}` : 'account created: null';
    snString += snUser.socials.birthday ? `\nborn ${getDiscordRelativeTime(snUser.socials.birthday)}` : '';

    const linkEmbed = new EmbedBuilder()
        .setAuthor({
            iconURL: snUser.avatarUrl,
            name: "@" + snUser.username,
            url: `https://sticknodes.com/members/${snUser.username}/profile`
        })
        .setThumbnail(discordUser.avatarURL())
        .setDescription(`linked to <@${discordUser.id}>`)
        .addFields([
            {
                name: 'Discord',
                value: `account created ${getDiscordRelativeTime(discordUser.createdAt)}`
            },
            {
                name: 'sticknodes.com',
                value: snString
            }
        ])

    sendEmbed(ChannelId.Log, linkEmbed, ThreadId.SNLinking);
}

export async function checkIfUserIsBanned(snUser:SnUser, discordUser: User) : Promise<void> {
    if (snUser.banned) {
        const message = `Discord user <@${discordUser.id}> just ran \`/link ${snUser.username}\`. SN user [${snUser.username}](https://sticknodes.com/members/${snUser.username}/) is a banned user.`;
        sendAlert(ChannelId.ModTalk, message);
    }
}