import { EmbedBuilder, type ColorResolvable } from 'discord.js';
import type { SnUser } from '../types/types.js';
import { formatUserStats, formatUserSocials, formatUserPreviews, formatBadgePreviews, formatTrophies, formatGroupPreviews, truncateString } from './format.js';
import { getAccentColorFromUrl, getRandomDefaultAvatarUrl } from './images.js';

export async function getUserEmbed(user: SnUser) {
    const accentColor = await getAccentColorFromUrl(user.avatarUrl) as ColorResolvable;
    const unlockedTrophies = user.trophies.filter(trophy => trophy.unlockDate !== null);
    return new EmbedBuilder()
        .setAuthor({
            name: truncateString(`@${user.username}`, 256),
            url: `https://sticknodes.com/members/${user.username}/profile/`
        })
        .setTitle(truncateString(user.displayname, 256))
        .setDescription(truncateString(user.bio, 2048))
        .addFields(
            {
                name: "Badges",
                value: formatBadgePreviews(user.badges),
                inline: false
            },
            {
                name: `Trophies (${unlockedTrophies.length}/10)`,
                value: formatTrophies(unlockedTrophies),
                inline: false
            },
            {
                name: `Managed Groups (${user.managedGroups.length})`,
                value: formatGroupPreviews(user.managedGroups),
                inline: false
            },
            {
                name: "Socials",
                value: truncateString(formatUserSocials(user.socials), 512),
                inline: false
            },
            {
                name: "Linked Discord User",
                value: "No linked user.",
                inline: false
            }
        )
        .setThumbnail(user.avatarUrl)
        .setColor(accentColor)
        .setFooter({
            text: truncateString(user.commentCaption, 64),
        });
}

export function getUserNotFoundEmbed(username: string) {
    return new EmbedBuilder()
        .setTitle(truncateString(`User "${username}" not found :(`, 256))
        .setThumbnail(getRandomDefaultAvatarUrl())
        .setColor("#ee1111");
}