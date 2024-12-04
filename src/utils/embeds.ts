import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, GuildMember, type APIEmbed, type ColorResolvable, type InteractionReplyOptions } from 'discord.js';
import type { SnUser } from '../types/types.js';
import { formatUserSocials, formatBadgePreviews, formatTrophies, formatGroupPreviews, truncateString } from './format.js';
import { getAccentColorFromUrl, getRandomDefaultAvatarUrl } from './images.js';
import { getImagePath } from './assets.js';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { colorRoleIdsToRoleMentionsWithRequirements, htmlToMarkdown, roleIdsToRoleMentions, dbUsersToDiscordMentions } from './strings.js';
import { getCasualMonthDayStringFromDate, getCasualMonthDayYearStringFromDate, timeAgo } from './dates.js';
import { getUnlockedColors, syncBadgeRoles } from './roles.js';
import { CustomError } from './errors.js';
import { ColorRole } from '../constants/roles.js';
import { Color } from '../constants/colors.js';
import { ErrorType } from '../constants/errors.js';
import { descriptionVariants, titleVariants } from '../constants/birthdayMessages.js';

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
            value: `- Has **${user.stats.friendCount}** friends\n- Is in **${user.stats.groupCount}** groups\n- Is owner of **${user.ownerCount}** groups\n- Is admin of **${user.adminCount}** groups\n- Is mod of **${user.modCount}** groups${user.socials.birthday ? `\n- Birthday is **${getCasualMonthDayStringFromDate(user.socials.birthday)}**` : ''}${user.stats.joinDate ? `\n- Joined on **${getCasualMonthDayYearStringFromDate(user.stats.joinDate)}**` : ''}`,
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
        .setColor(Color.ErrorRed);
}

export function getUserFoundEmbed(user: SnUser, stillLinkedId: string | null = null) {
    const description = `Would you like to link this user?${stillLinkedId ? ` \n\n⚠️ This sticknodes.com account is currently linked to <@${stillLinkedId}>. Linking it to the account you're using now will unlink it from <@${stillLinkedId}>.` : ''}`;

    return new EmbedBuilder()
        .setTitle(truncateString(`User "${user.username}" found :D`, 256))
        .setDescription(description)
        .setThumbnail(user.avatarUrl)
        .setColor(Color.SuccessGreen);
}

export function getNoUserLinkedEmbed(discordId: string) {
    return new EmbedBuilder()
        .setDescription(truncateString(`No linked sticknodes.com account found for Discord user <@${discordId}>.`, 4096))
        .setColor(Color.ErrorRed);
}

export function getLinkSuccessEmbed(discordId: string, snUsername: string) {
    return new EmbedBuilder()
        .setDescription(truncateString(`Successfully linked **${snUsername}** to <@${discordId}>!`, 4096))
        .setFooter({ text: "💡 You can remove the key from your bio. It is no longer needed." })
        .setColor(Color.SuccessGreen);
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
        .setTitle("😔 Error encountered.")
        .setDescription(`Error message: ${error}`)
        .setColor(Color.TotalRed)
}

export function getWarningEmbed(warning: string, footer?: string) {
    const embed = new EmbedBuilder()
        .setTitle("Notice")
        .setDescription(`${warning}`)
        .setColor(Color.TotalYellow)
  
    if (footer) embed.setFooter({text: footer});

    return embed;
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
        .setColor(Color.HintYellow)

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
            }
        )
        .setImage(`attachment://${imageName}`)
        .setFooter({ text: "This merely proves to DemonBot that you own this sticknodes.com account. It does not affect your Discord account or sticknodes.com account." })
        .setColor(Color.NeutralBlue);

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

export function getKeyReply(key: string) {
    const reply: InteractionReplyOptions = {
        content: key,
        ephemeral: true
    }

    return reply;
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
        .setColor(Color.TotalYellow);
}

export function getBasicEmbed(titleDescriptionColor: { title?: string, description?: string, color?: number }) {
    const title = titleDescriptionColor.title ?? null;
    const description = titleDescriptionColor.description ?? null;
    const color = titleDescriptionColor.color ?? null;

    if (!title && !description) throw new CustomError("Whoever programmed this part of me forgot getBasicEmbed cannot have both a null title and null description... :/", ErrorType.Error);

    return new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(color);
}

export function getUnlockedColorsEmbed(member: GuildMember) {
    const unlockedColors = getUnlockedColors(member);
    const allColors = Object.values(ColorRole);

    const lockedColors = allColors.filter(
        color => !unlockedColors.includes(color)
    );
    let unlockedColorsString = 'None :(';
    let lockedColorsString = 'None :)';

    try {
        unlockedColorsString = '- ' + roleIdsToRoleMentions(Object.values(unlockedColors)).join('\n- ');
    } catch { }

    try {
        lockedColorsString = '- ' + colorRoleIdsToRoleMentionsWithRequirements(lockedColors).join('\n- ');
    } catch { }

    return new EmbedBuilder()
        .setFields(
            {
                name: "Unlocked Colors",
                value: unlockedColorsString,
                inline: false
            },
            {
                name: "Locked Colors",
                value: lockedColorsString,
                inline: false
            }
        )
}

export function getBirthdayEmbed(birthdayUsers: {
    discordId: string;
    birthday: Date | null;
}[]) {

    if (birthdayUsers.length == 0) throw new Error('birthdays array is empty! cannot construct birthday array!');

    try {
        const mentions = dbUsersToDiscordMentions(birthdayUsers);

        const isPlural = (mentions: string[]): boolean => mentions.length > 1;

        const title = titleVariants[Math.floor(Math.random() * titleVariants.length)] ?? 'Error';
        const descriptionVariant = descriptionVariants[Math.floor(Math.random() * descriptionVariants.length)];

        if (!descriptionVariant) throw new Error('description variant is not defined. cannot construct birthday array.');

        const description = descriptionVariant(mentions, isPlural(mentions));

        return new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor('#ff00ff');
    } catch (error) {
        throw error;
    }
}

export function parseEmbeds(rawEmbeds: string | undefined): APIEmbed[] | undefined {
    if (!rawEmbeds) return undefined;

    const convertHexToInt = (hex: string) => parseInt(hex.replace(/^#/, ''), 16);
    const isEpochTime = (value: number) => value.toString().length >= 10 && value.toString().length <= 13;

    try {
        const parsed = JSON.parse(rawEmbeds);
        const embedArray = Array.isArray(parsed) ? parsed : [parsed];

        return embedArray.map((embed: any) => {
            if (embed.color) {
                if (typeof embed.color === 'string' && embed.color.startsWith('#')) {
                    embed.color = convertHexToInt(embed.color);
                } else if (typeof embed.color !== 'number') {
                    throw new Error('Invalid color format. Use a hex string (e.g., #FF5733) or an integer.');
                }
            }

            if (embed.timestamp) {
                if (typeof embed.timestamp === 'number' && isEpochTime(embed.timestamp)) {
                    embed.timestamp = new Date(embed.timestamp).toISOString();
                } else if (typeof embed.timestamp === 'string') {
                    embed.timestamp = new Date(embed.timestamp).toISOString();
                } else {
                    throw new Error('Invalid timestamp format. Use a valid Epoch time or ISO8601 string.');
                }
            }

            return embed;
        });
    } catch (error) {
        let err = null;
        if (error instanceof Error) err = error;
        throw new CustomError(`Invalid embed JSON provided.`, ErrorType.Error, err);
    }
}