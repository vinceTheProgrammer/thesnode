import type { SnUserPreview } from './types.js';

export interface SnBadge {
    id: string,
    name: string,
    iconUrl: string,
    codename: string,
    description: string,
    users: SnUserPreview[]
}

export interface SnBadgePreview {
    id: string,
    name: string,
    iconUrl: string
}