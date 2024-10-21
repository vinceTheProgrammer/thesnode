import type { SnBadgePreview, SnGroupPreview, SnTrophy } from './types.js';

export interface SnUser {
    id: number,
    username: string,
    displayname: string,
    avatarUrl: string,
    bio: string,
    badges: SnBadgePreview[],
    trophies: SnTrophy[],
    stats: SnUserStats,
    managedGroups: SnGroupPreview[],
    ownerCount: number,
    adminCount: number,
    modCount: number,
    groups: SnGroupPreview[],
    friends: SnUserPreview[],
    socials: SnUserSocials,
    commentCaption: string,
    banned: boolean,
    fetchDate: Date | null,
}

export interface SnUserPreview {
    id: number,
    username: string,
    displayname: string,
    avatarUrl: string
}

export interface SnUserStats {
    joinDate: Date,
    submissionCount: number,
    firstSubmissionDate: Date | null,
    lastSubmissionDate: Date | null,
    featuredCount: number | null,
    usersChoiceCount: number | null,
    averageDownloads: number | null,
    totalDownloads: number | null,
    totalStickfigures: number | null,
    averageStickfigureRating: number | null,
    averageSpotlightRating: number | null,
    commentCount: number,
    activityCommentCount: number,
    consecutiveVisitCount: number | null,
    bestConsecutiveVisitCount: number | null,
    averageWeeklyPostCount: number | null,
    averageWeeklyCommentCount: number | null,
    spotlightFeatureCount: number | null,
    isUserChoiceVoter: boolean,
    votingStreak: number | null,
    bestVotingStreak: number | null,
    friendCount: number,
    groupCount: number
}

export interface SnUserSocials {
    youtube: string | null,
    discord: string | null,
    twitter: string | null,
    facebook: string | null,
    instagram: string | null,
    rumble: string | null,
    birthday: Date | null
}