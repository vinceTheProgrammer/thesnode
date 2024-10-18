import type { SnUserPreview } from './types.js';


export interface SnGroup {
    id: string,
    name: string,
    public: boolean,
    description: string,
    admins: SnUserPreview[],
    mods: SnUserPreview[],
    members: SnUserPreview[],
    stats: SnGroupStats,
    pinnedUpdate: string // PLACEHOLDER
}

export enum GroupManagement {
    Owner = 'owner',
    Administrator = 'administrator',
    Moderator = 'moderator',
    None = 'none',
    Unknown = 'unknown'
}

export interface SnGroupPreview {
    id: string,
    name: string,
    iconUrl: string,
    public: boolean,
    management: GroupManagement
}

export interface SnGroupStats {
    createdDate: Date,
    createdUser: SnUserPreview,
    averageWeeklyUpdates: number,
    averageWeeklyComments: number
}