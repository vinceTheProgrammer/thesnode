import * as cheerio from 'cheerio';
import { DEFAULT_USER_STATS, DEFAULT_USER_SOCIALS } from '../constants/defaults.js';
import type { SnUserSocials, SnUserStats, SnUser, SnTrophy, SnGroupPreview, SnBadgePreview } from '../types/types.js';
import type { Element, Text } from 'domhandler';
import { ordinalStringToNumber } from './format.js';
import { GroupManagement } from '../types/SnGroup.js';

export function updateSnUserBasicDataFromHtml(user: SnUser, html: string): SnUser {
    const $ = cheerio.load(html);

    const extractProfileFieldValue = (className: string): string | null => {
        const fieldValue = $(`.profile-fields .${className} .field-value p`).text().trim();
        return fieldValue.length > 0 ? fieldValue : null;
    };

    user.username = $('.user-nicename', '#item-header-content').text().replaceAll('@', '');
    user.avatarUrl = $('.avatar', '#item-header-avatar').attr('src') ?? user.avatarUrl;
    user.displayname = extractDisplayNameFromHtml(html);
    user.bio = extractProfileFieldValue('field_bio') ?? ' ';
    user.commentCaption = extractProfileFieldValue('field_comment-caption') ?? ' ';

    if (user.username === "demonbot") return user;

    user.id = ordinalStringToNumber(extractSpanText('.user-stats p:contains("person to register")', $, 2)) ?? 0;

    const isBanned = $('.sn-user-banned-badge', '#item-header-avatar').length > 0;

    user.banned = isBanned;

    return user;
}

export function getSnUserBadgesFromHtml(html: string): SnBadgePreview[] {
    const $ = cheerio.load(html);
    const badges: SnBadgePreview[] = [];

    // Iterate over each span with a role badge inside user-roles-list
    $('.user-roles-list > span').each((_, element) => {
        const anchor = $(element).find('a');
        const img = anchor.find('img');
        const span = anchor.find('span');

        // Extracting data
        const roleUrl = anchor.attr('href') || '';
        const idMatch = roleUrl.match(/role=([^&]+)/);
        const id = idMatch ? idMatch[1] : 'unknown';

        const iconUrl = img.attr('src') || '';
        const name = span.text().trim();

        if (id && name && iconUrl) {
            badges.push({ id, name, iconUrl });
        }
    });

    return badges;
}

export function getSnUserTrophiesFromHtml(html: string): SnTrophy[] {
    const $ = cheerio.load(html);
    const trophies: SnTrophy[] = [];

    // Iterate over each trophy <a> tag inside <li> elements
    $('ul > li > a.wpsn-trophy').each((_, element) => {
        const trophyElement = $(element);

        // Extract attributes
        const item = trophyElement.attr('data-item') || 'Unknown Item';
        const name = trophyElement.attr('data-name') || 'Unknown Name';
        const description = trophyElement.attr('data-desc') || 'No Description';
        const iconUrl = trophyElement.find('img').attr('src') || 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/trophies/small/mystery.png';

        const rawDate = trophyElement.attr('data-date') || '5318008';
        const unlockDate = rawDate === '5318008' ? null : new Date(rawDate);

        const rarity = parseInt(trophyElement.attr('data-rarity') || '0', 10);

        // Add trophy to the array
        trophies.push({
            item,
            name,
            iconUrl,
            description,
            unlockDate,
            rarity,
        });
    });

    return trophies;
}

export function getSnUserOwnerCountFromManagedGroups(groups: SnGroupPreview[]) {
    return groups.filter(el => el.management === GroupManagement.Owner).length;
}

export function getSnUserAdminCountFromManagedGroups(groups: SnGroupPreview[]) {
    return groups.filter(el => el.management === GroupManagement.Administrator).length;
}

export function getSnUserModCountFromManagedGroups(groups: SnGroupPreview[]) {
    return groups.filter(el => el.management === GroupManagement.Moderator).length;
}

export function getSnUserManagedGroupsFromHtml(html: string): SnGroupPreview[] {
    const $ = cheerio.load(html);
    const groups: SnGroupPreview[] = [];

    $('.members-groups ul li').each((_, element) => {
        const anchor = $(element).find('a');
        const href = anchor.attr('href') || '';
        const id = href.split('/groups/')[1]?.replace('/', '') || '';

        const iconUrl = anchor.find('img').attr('src') || '';
        const name = anchor.find('.name').text().trim();
        const isPrivate = anchor.find('.private').length > 0;

        const type = anchor.find('.type-container').find('span').text().trim().toLowerCase();
        let management = GroupManagement.Unknown;
        switch (type) {
            case 'owner':
                management = GroupManagement.Owner;
                break;
            case 'admin':
                management = GroupManagement.Administrator;
                break;
            case 'mod':
                management = GroupManagement.Moderator;
                break;
            default:
                management = GroupManagement.Unknown;
        }

        const group: SnGroupPreview = {
            id,
            name,
            iconUrl,
            public: !isPrivate,
            management: management
        };

        groups.push(group);
    });

    return groups;
}

export function getSnUserStatsFromHtml(html: string): SnUserStats {
    const stats: SnUserStats = { ...DEFAULT_USER_STATS };
    const $ = cheerio.load(html);

    stats.joinDate = extractDate(extractSpanText('.user-stats', $)) ?? new Date();
    stats.submissionCount = extractInt(extractSpanText('.user-stats p:contains("Has")', $)) ?? 0;
    stats.firstSubmissionDate = extractDate(extractSpanText('.user-stats p:contains("first one uploaded on")', $, 1));
    stats.lastSubmissionDate = extractDate(extractSpanText('.user-stats p:contains("most recent on")', $, 2));
    stats.featuredCount = extractInt(extractSpanText('.user-stats p:contains("featured")', $));
    stats.usersChoiceCount = extractInt(extractSpanText('.user-stats p:contains("Users\' Choice")', $, 1));
    stats.averageDownloads = extractInt(extractSpanText('.user-stats p:contains("earns")', $));
    stats.totalDownloads = extractInt(extractSpanText('.user-stats p:contains("downloaded")', $));
    stats.totalStickfigures = extractInt(extractSpanText('.user-stats p:contains("stickfigures")', $));
    stats.averageStickfigureRating = extractPercent(extractSpanText('.user-stats p:contains("positive")', $));
    stats.averageSpotlightRating = extractPercent(extractSpanText('.user-stats p:contains("typically")', $, 1));
    stats.commentCount = extractInt(extractSpanText('.user-stats p:contains("comments on non-activity pages")', $)) ?? 0;
    stats.activityCommentCount = extractInt(extractSpanText('.user-stats p:contains("on actual activity pages")', $, 1)) ?? 0;
    stats.consecutiveVisitCount = extractInt(extractSpanText('.user-stats p:contains("consecutively for")', $));
    stats.bestConsecutiveVisitCount = extractInt(extractSpanText('.user-stats p:contains("best streak being")', $, 1));
    stats.averageWeeklyPostCount = extractInt(extractSpanText('.user-stats p:contains("post")', $, 2));
    stats.averageWeeklyCommentCount = extractInt(extractSpanText('.user-stats p:contains("comments per week")', $, 3));
    stats.spotlightFeatureCount = extractInt(extractSpanText('.user-stats p:contains("Animation Spotlights")', $));
    stats.isUserChoiceVoter = $('.user-stats p:contains("Users\' Choice voter")').length > 0;
    stats.votingStreak = extractInt(extractSpanText('.user-stats p:contains("voting streak")', $));
    stats.bestVotingStreak = extractInt(extractSpanText('.user-stats p:contains("longest streak")', $, 1));
    stats.friendCount = extractInt($('span', '#user-friends').text()) ?? 0;
    stats.groupCount = extractInt($('span', '#user-groups').text()) ?? 0;

    return stats;
}

export function getSnUserSocialsFromHtml(html: string): SnUserSocials {
    const socials: SnUserSocials = { ...DEFAULT_USER_SOCIALS };
    const $ = cheerio.load(html);

    socials.youtube = extractFieldValue('field_youtube', $);
    socials.discord = extractFieldValue('field_discord', $);
    socials.twitter = extractFieldValue('field_twitter', $);
    socials.facebook = extractFieldValue('field_facebook', $);
    socials.instagram = extractFieldValue('field_instagram', $);
    socials.rumble = extractFieldValue('field_rumble', $);

    const birthdayStr = extractFieldValue('field_birthday', $);
    if (birthdayStr) {
        try {
            socials.birthday = new Date(birthdayStr);
        } catch (error) {
            console.error(`Failed to parse birthday: ${birthdayStr}`);
        }
    }

    return socials;
}

export function extractDisplayNameFromHtml(html: string): string {
    const $ = cheerio.load(html);

    // Extract the first child node of '.page-title'
    const displaynameElement = $('.page-title').contents().first().get(0);

    // Check if it's a TextNode and contains data
    if (displaynameElement && displaynameElement.type === 'text') {
        const textNode = displaynameElement as Text;
        return textNode.data?.trim() || 'Error getting displayname';
    }

    return 'Error getting displayname';
}

function extractInt(text: string): number | null {
    const num = parseInt(text.replace(/,/g, ''), 10);
    return isNaN(num) ? null : num;
};

function extractDate(text: string): Date | null {
    const cleanDateString = text.replace(/(\d+)(st|nd|rd|th)/, "$1");
    try {
        return new Date(cleanDateString);
    } catch (error) {
        console.error(`Failed to parse date: ${cleanDateString}`);
        return null;
    }
};

function extractPercent(text: string): number | null {
    const percent = parseFloat(text.replace('%', ''));
    return isNaN(percent) ? null : percent;
};

function extractSpanText(selector: string, $: cheerio.CheerioAPI, spanIndex: number = 0): string {
    return $(selector).find('span').eq(spanIndex).text().trim();
}

function extractFieldValue(className: string, $: cheerio.CheerioAPI): string | null {
    const fieldValue = $(`.profile-fields .${className} .field-value p`).text().trim();
    return fieldValue.length > 0 ? fieldValue : null;
};