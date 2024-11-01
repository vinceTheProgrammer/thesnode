import type { SnUser, SnUserPreview, SnBadge, SnGroup, SnGroupStats, SnUserSocials, SnUserStats, SnTrophy } from '../types/types.js';

export const DEFAULT_BADGE: SnBadge = {
    id: 'default-badge',
    name: 'Default Badge',
    iconUrl: 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/trophies/small/mystery.png',
    codename: 'A Default Badge',
    description: 'This is a default badge.',
    users: []
};

export const DEFAULT_TROPHY: SnTrophy = {
    item: 'default-trophy',
    name: 'Default Trophy',
    iconUrl: 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/trophies/small/mystery.png',
    description: 'This is a default trophy.',
    unlockDate: null,
    rarity: 0
};

export const DEFAULT_USER_PREVIEW: SnUserPreview = {
    id: 0,
    username: 'default_user',
    displayname: 'Default User',
    avatarUrl: 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/default-avatars/01.png'
};

export const DEFAULT_GROUP_STATS: SnGroupStats = {
    createdDate: null,
    createdUser: { ...DEFAULT_USER_PREVIEW},
    memberCount: 0,
    averageWeeklyUpdates: 0,
    averageWeeklyComments: 0
};

export const DEFAULT_GROUP: SnGroup = {
    id: 'default-group',
    name: 'Default Group',
    iconUrl: 'https://sticknodes.com/wp-content/plugins/buddypress/bp-core/images/mystery-group-50.png',
    public: false,
    description: 'This is a default group.',
    admins: [],
    mods: [],
    members: [],
    stats: { ...DEFAULT_GROUP_STATS},
    pinnedUpdate: '', // PLACEHOLDER,
    fetchDate: null
};

export const DEFAULT_USER_STATS: SnUserStats = {
    joinDate: null,
    submissionCount: 0,
    firstSubmissionDate: null,
    lastSubmissionDate: null,
    featuredCount: null,
    usersChoiceCount: null,
    averageDownloads: null,
    totalDownloads: null,
    totalStickfigures: null,
    averageStickfigureRating: null,
    averageSpotlightRating: null,
    commentCount: 0,
    activityCommentCount: 0,
    consecutiveVisitCount: null,
    bestConsecutiveVisitCount: null,
    averageWeeklyPostCount: null,
    averageWeeklyCommentCount: null,
    spotlightFeatureCount: null,
    isUserChoiceVoter: false,
    votingStreak: null,
    bestVotingStreak: null,
    friendCount: 0, 
    groupCount: 0
};

export const DEFAULT_USER_SOCIALS: SnUserSocials = {
    youtube: null,
    discord: null,
    twitter: null,
    facebook: null,
    instagram: null,
    rumble: null,
    birthday: null
};

export const DEFAULT_USER: SnUser = {
    id: 0,
    username: 'default_user',
    displayname: 'Default User',
    avatarUrl: 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/default-avatars/01.png',
    bio: 'This is a default user.',
    badges: [],
    trophies: [],
    stats: { ...DEFAULT_USER_STATS },
    managedGroups: [],
    ownerCount: 0,
    adminCount: 0,
    modCount: 0,
    groups: [],
    friends: [],
    commentCaption: 'This is a default comment.',
    socials: { ...DEFAULT_USER_SOCIALS },
    banned: false,
    fetchDate: null
};