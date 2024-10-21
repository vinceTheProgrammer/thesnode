import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, type ColorResolvable } from 'discord.js';
import type { SnUser } from '../types/types.js';
import { formatUserSocials, formatBadgePreviews, formatTrophies, formatGroupPreviews, truncateString } from './format.js';
import { getAccentColorFromUrl, getRandomDefaultAvatarUrl } from './images.js';
import { getImagePath } from './assets.js';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { htmlToMarkdown } from './strings.js';
import { getCasualMonthDayStringFromDate, getCasualMonthDayYearStringFromDate, timeAgo } from './dates.js';
import { syncBadgeRoles } from './roles.js';

export async function getUserEmbed(user: SnUser, linkedDiscordMember: GuildMember | null = null) {

    const linkedDiscordId = linkedDiscordMember?.id ?? null;

    if (user.username === 'demonbot') return getDemonbotEmbed(user);

    if (linkedDiscordMember) syncBadgeRoles(linkedDiscordMember, user).catch(err => { console.log(err) });

    const accentColor = await getAccentColorFromUrl(user.avatarUrl) as ColorResolvable;
    const unlockedTrophies = user.trophies.filter(trophy => trophy.unlockDate !== null);
    let markdownBio = htmlToMarkdown(user.bio);
    if (markdownBio.length === 0) markdownBio = ' ';

    const fields = [
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
            name: `Key Stats`,
            value: `- Has **${user.stats.friendCount}** friends\n- Is in **${user.stats.groupCount}** groups\n- Is owner of **${user.ownerCount}** groups\n- Is admin of **${user.adminCount}** groups\n- Is mod of **${user.modCount}** groups${user.socials.birthday ? `\n- Birthday is **${getCasualMonthDayStringFromDate(user.socials.birthday)}**` : ''}\n- Joined on **${getCasualMonthDayYearStringFromDate(user.stats.joinDate)}**`,
            inline: false
        },
        {
            name: "Socials",
            value: truncateString(formatUserSocials(user.socials), 512),
            inline: false
        },
        {
            name: "Linked Discord User",
            value: `${linkedDiscordId ? `<@${linkedDiscordId}>` : 'No linked user.'}`,
            inline: false
        }
    ]

    if (user.fetchDate) {
        fields.push({
            name: '\u200b',
            value: `This profile data was fetched **${timeAgo(user.fetchDate)}**.`,
            inline: false
        });
    }

    return new EmbedBuilder()
        .setAuthor({
            name: truncateString(`@${user.banned ? `${user.username} [BANNED]` : user.username}`, 256),
            url: `https://sticknodes.com/members/${user.username}/profile/`
        })
        .setTitle(truncateString(user.displayname, 256))
        .setDescription(truncateString(markdownBio, 2048))
        .addFields(fields)
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

export function getUserFoundEmbed(user: SnUser, stillLinkedId: string | null = null) {
    const description = `Would you like to link this user?${stillLinkedId ? ` \n\n⚠️ This sticknodes.com account is currently linked to <@${stillLinkedId}>. Linking it to the account you're using now will unlink it from <@${stillLinkedId}>.` : ''}`;

    return new EmbedBuilder()
        .setTitle(truncateString(`User "${user.username}" found :D`, 256))
        .setDescription(description)
        .setThumbnail(user.avatarUrl)
        .setColor("#11ee11");
}

export function getNoUserLinkedEmbed(discordId: string) {
    return new EmbedBuilder()
        .setDescription(truncateString(`No linked sticknodes.com account found for Discord user <@${discordId}>.`, 4096))
        .setColor("#ee1111");
}

export function getLinkSuccessEmbed(discordId: string, snUsername: string) {
    return new EmbedBuilder()
        .setDescription(truncateString(`Successfully linked **${snUsername}** to <@${discordId}>!`, 4096))
        .setFooter({ text: "💡 You can remove the key from your bio. It is no longer needed." })
        .setColor("#11ee11");
}

// imposter
export function getLinkUserConfirmationMessage(user: SnUser, stillLinkedId: string | null = null) {
    const embed = getUserFoundEmbed(user, stillLinkedId);

    const confirmButton = new ButtonBuilder()
        .setCustomId('link-init')
        .setLabel('Initiate Link')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(confirmButton);

    return new MessageBuilder()
        .setContent('')
        .setEmbeds([embed])
        .setComponents([row]);
}

export function getErrorEmbed(error: string) {
    return new EmbedBuilder()
        .setTitle("😔 Error encountered. Please tell vincetheanimator")
        .setDescription(`Error message: ${error}`)
        .setColor('#ff0000')
}

export function getWarningEmbed(warning: string) {
    return new EmbedBuilder()
        .setTitle("Notice")
        .setDescription(`${warning}`)
        .setColor('#ffff00')
}

interface MessageAndEmbed {
    messageBuilder: MessageBuilder,
    embedBuilder: EmbedBuilder
}

export function getUsernameHintMessageAndEmbed(): MessageAndEmbed {
    const imageName = 'help_link_username.jpg';

    const file = new AttachmentBuilder(getImagePath(imageName));

    const embed = new EmbedBuilder()
        .setDescription(`💡 Make sure you're using the right username. It should be on your profile page after the @ or in the page url.`)
        .setImage(`attachment://${imageName}`)
        .setColor('#eeee11')

    const message = new MessageBuilder()
        .addFile(file)
        .setEmbeds([embed])
        .setContent('');

    return {
        messageBuilder: message,
        embedBuilder: embed
    }
}

export function getLinkMessageAndEmbed(key: string, discordId: string, snUsername: string): MessageAndEmbed {
    const imageName = 'help_link_bio.jpg';

    const file = new AttachmentBuilder(getImagePath(imageName));

    const embed = new EmbedBuilder()
        .setDescription(`**Prepare to link sticknodes.com user __@${snUsername}__ to discord user <@${discordId}>.**`)
        .setFields(
            {
                name: "Instructions",
                value: `1. Navigate to your [sticknodes.com profile](https://sticknodes.com/members/${snUsername}/profile).\n2. Edit this key: **${key}** anywhere in your bio.\n3. Click "Verify Ownership" button below.\n4. Once verification is complete, you can remove the key from your bio.`,
                inline: false
            },
            {
                name: "For copying key on mobile",
                value: key,
                inline: false
            }
        )
        .setImage(`attachment://${imageName}`)
        .setFooter({ text: "This merely proves to TheSnode that you own this sticknodes.com account. It does not affect your Discord account or sticknodes.com account." })
        .setColor('#1111ee')

    const verifyButton = new ButtonBuilder()
        .setCustomId('link-verify')
        .setLabel('Verify Ownership')
        .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(verifyButton);

    const message = new MessageBuilder()
        .addFile(file)
        .setEmbeds([embed])
        .setContent('')
        .setComponents([row]);

    return {
        messageBuilder: message,
        embedBuilder: embed
    }
}

async function getDemonbotEmbed(user: SnUser) {
    const accentColor = await getAccentColorFromUrl(user.avatarUrl) as ColorResolvable;
    return new EmbedBuilder()
        .setAuthor({
            name: truncateString(`@${user.username}`, 256),
            url: `https://sticknodes.com/members/${user.username}/profile/`
        })
        .setTitle(truncateString(user.displayname, 256))
        .setDescription(truncateString(htmlToMarkdown(user.bio), 2048))
        .setThumbnail(user.avatarUrl)
        .setColor(accentColor)
        .setFooter({
            text: truncateString(user.commentCaption, 64),
        });
}

export function getAlertEmbed(message: string) {
    return new EmbedBuilder()
        .setTitle('⚠️ Alert')
        .setDescription(message)
        .setColor('#ffff00');
}