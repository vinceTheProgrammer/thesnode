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

export interface SnGroupPreview {
    id: string,
    name: string,
    iconUrl: string,
    public: boolean,
}

export interface SnGroupStats {
    createdDate: Date,
    createdUser: SnUserPreview,
    averageWeeklyUpdates: number,
    averageWeeklyComments: number
}