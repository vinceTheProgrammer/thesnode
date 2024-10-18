import type { SnUserStats, SnUserSocials, SnUserPreview, SnGroupPreview, SnTrophy, SnBadgePreview } from '../types/types.js';

export function formatUserStats(stats: SnUserStats): string {
    const entries: string[] = [];

    if (stats.joinDate) entries.push(`Joined: ${stats.joinDate.toDateString()}`);
    if (stats.submissionCount) entries.push(`Submissions: ${stats.submissionCount}`);
    if (stats.firstSubmissionDate) entries.push(`First Submission: ${stats.firstSubmissionDate.toDateString()}`);
    if (stats.lastSubmissionDate) entries.push(`Last Submission: ${stats.lastSubmissionDate.toDateString()}`);
    if (stats.featuredCount) entries.push(`Featured: ${stats.featuredCount}`);
    if (stats.usersChoiceCount) entries.push(`User's Choice: ${stats.usersChoiceCount}`);
    if (stats.averageDownloads) entries.push(`Average Downloads: ${stats.averageDownloads}`);
    if (stats.totalDownloads) entries.push(`Total Downloads: ${stats.totalDownloads}`);
    if (stats.totalStickfigures) entries.push(`Total Stickfigures: ${stats.totalStickfigures}`);
    if (stats.averageStickfigureRating) entries.push(`Avg. Stickfigure Rating: ${stats.averageStickfigureRating}%`);
    if (stats.averageSpotlightRating) entries.push(`Avg. Spotlight Rating: ${stats.averageSpotlightRating}%`);
    if (stats.commentCount) entries.push(`Comments: ${stats.commentCount}`);
    if (stats.activityCommentCount) entries.push(`Activity Comments: ${stats.activityCommentCount}`);
    if (stats.consecutiveVisitCount) entries.push(`Consecutive Visits: ${stats.consecutiveVisitCount}`);
    if (stats.bestConsecutiveVisitCount) entries.push(`Best Visit Streak: ${stats.bestConsecutiveVisitCount}`);
    if (stats.averageWeeklyPostCount) entries.push(`Avg. Weekly Posts: ${stats.averageWeeklyPostCount}`);
    if (stats.averageWeeklyCommentCount) entries.push(`Avg. Weekly Comments: ${stats.averageWeeklyCommentCount}`);
    if (stats.spotlightFeatureCount) entries.push(`Spotlight Features: ${stats.spotlightFeatureCount}`);
    if (stats.isUserChoiceVoter) entries.push(`User Choice Voter: Yes`); else entries.push(`User Choice Voter: No`);
    if (stats.votingStreak) entries.push(`Voting Streak: ${stats.votingStreak}`);
    if (stats.bestVotingStreak) entries.push(`Best Voting Streak: ${stats.bestVotingStreak}`);

    return entries.length ? '- ' + entries.join('\n- ') : 'No stats available.';
}

export function formatUserSocials(socials: SnUserSocials): string {
    const entries: string[] = [];

    const urlPattern = /^(https?:\/\/)/;

    if (socials.youtube && urlPattern.test(socials.youtube)) {
        entries.push(`[YouTube](${socials.youtube})`);
    }
    if (socials.discord && urlPattern.test(socials.discord)) {
        entries.push(`[Discord Server](${socials.discord})`);
    }
    if (socials.twitter && urlPattern.test(socials.twitter)) {
        entries.push(`[Twitter](${socials.twitter})`);
    }
    if (socials.facebook && urlPattern.test(socials.facebook)) {
        entries.push(`[Facebook](${socials.facebook})`);
    }
    if (socials.instagram && urlPattern.test(socials.instagram)) {
        entries.push(`[Instagram](${socials.instagram})`);
    }
    if (socials.rumble && urlPattern.test(socials.rumble)) {
        entries.push(`[Rumble](${socials.rumble})`);
    }
    //if (socials.birthday) entries.push(`Birthday: ${socials.birthday.toDateString()}`);

    return entries.length ? entries.join(' • ') : 'No socials available.';
}

export function truncateString(input: string, maxLength: number): string {
    if (input.length <= maxLength) return input;
    return input.slice(0, maxLength - 3) + '...';
}

export function formatUserPreviews(users: SnUserPreview[]): string {
    if (users.length === 0) return 'No users available.';

    const entries = users.map(user => user.displayname);
    const result = '- ' + entries.join('\n- ');
    return truncateString(result, 1024);
}

export function formatGroupPreviews(groups: SnGroupPreview[]): string {
    if (groups.length === 0) return 'No groups available.';

    const entries = groups.map(group => group.name);
    const result = entries.join(', ');
    return truncateString(result, 1024);
}

export function formatBadgePreviews(badges: SnBadgePreview[]): string {
    if (badges.length === 0) return 'No badges available.';

    const entries = badges.map(badge => badge.name);
    const result = entries.join(', ');
    return truncateString(result, 512);
}

export function formatTrophies(trophies: SnTrophy[]): string {


    if (trophies.length === 0) return 'No trophies available.';

    const entries = trophies.map(trophy => trophy.name);
    const result = entries.join(', ');
    return truncateString(result, 256);
}


export function ordinalStringToNumber(input: string): number {
    // Remove commas and ordinal suffixes using regex
    const cleaned = input.replace(/(st|nd|rd|th)$/, "").replace(/,/g, "");

    // Convert the cleaned string to a number
    const number = parseInt(cleaned, 10);

    if (isNaN(number)) {
        throw new Error(`Invalid input: ${input}`);
    }

    return number;
}