import { GuildMember } from "discord.js";
import type { SnUser } from "../types/types.js";
import { BADGE_TO_ROLE, BadgeRole } from "../constants/roles.js";
import { CustomError, ErrorType } from "./errors.js";

export async function syncBadgeRoles(discordMember: GuildMember, snUser: SnUser) {
    const memberRoles = new Set(discordMember.roles.cache.keys());
    const badgeRoles = new Set<string>(
        snUser.badges
            .map(badge => BADGE_TO_ROLE[badge.id])
            .filter(roleId => roleId !== undefined) // Ensure we only handle valid roles
    );

    const rolesToAdd = [...badgeRoles].filter(role => !memberRoles.has(role));
    const rolesToRemove = [...memberRoles].filter(role => !badgeRoles.has(role) && (Object.values(BadgeRole) as string[]).includes(role));

    try {
        // Add roles
        if (rolesToAdd.length > 0) {
            await discordMember.roles.add(rolesToAdd);
        }

        // Remove roles
        if (rolesToRemove.length > 0) {
            await discordMember.roles.remove(rolesToRemove);
        }

        console.log(`Synced roles for ${snUser.username}`);
    } catch (error) {
        throw new CustomError(`Failed to sync roles for ${snUser.username}:`, ErrorType.Error, error as Error);
    }
}