import { GuildMember } from "discord.js";
import type { SnUser } from "../types/types.js";
import { BADGE_TO_ROLE_REGEX, BadgeRole, ColorRole, ColorToRoleIdMap, RoleId } from "../constants/roles.js";
import { CustomError } from "./errors.js";
import { ErrorType } from "../constants/errors.js";

export async function syncBadgeRoles(discordMember: GuildMember, snUser: SnUser) {
    const memberRoles = new Set(discordMember.roles.cache.keys());
    const badgeRoles = new Set<string>(
        snUser.badges
            .map(badge => {
                // Find the first matching role for the badge
                const match = BADGE_TO_ROLE_REGEX.find(entry => entry.pattern.test(badge.id));
                return match?.role; // Return the matched role or undefined
            })
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

    } catch (error) {
        throw new CustomError(`Failed to sync roles for ${snUser.username}:`, ErrorType.Error, error as Error);
    }
}

export async function clearBadgeRoles(discordMember: GuildMember) {
    const memberRoles = new Set(discordMember.roles.cache.keys());
    const rolesToRemove = [...memberRoles].filter(role => (Object.values(BadgeRole) as string[]).includes(role));

    try {
        if (rolesToRemove.length > 0) {
            await discordMember.roles.remove(rolesToRemove);
        }
    } catch (error) {
        throw new CustomError(`Failed to clear badge roles for <@${discordMember.id}>:`, ErrorType.Error, error as Error);
    }
}

export async function removeLinkedRole(discordMember: GuildMember) {
    try {
        await discordMember.roles.remove(RoleId.Linked);
    } catch (error) {
        throw new CustomError(`Failed to remove "Linked" role for <@${discordMember.id}>`, ErrorType.Error, error as Error);
    }
}

export async function giveLinkedRole(discordMember: GuildMember) {
    try {
        await discordMember.roles.add(RoleId.Linked);
    } catch (error) {
        throw new CustomError(`Failed to give "Linked" role to <@${discordMember.id}>`, ErrorType.Error, error as Error);
    }
}

export function getUnlockedColors(member: GuildMember): ColorRole[] {
    const unlockedColors = new Set<ColorRole>(); // Use Set to avoid duplicates

    for (const [color, badges] of Object.entries(ColorToRoleIdMap) as [ColorRole, BadgeRole[]][]) {
        // Check if the member has any of the required badge roles
        if (badges.some(badge => member.roles.cache.has(badge))) {
            unlockedColors.add(color); // Add the color to the set
        }
    }

    return Array.from(unlockedColors); // Convert Set back to array
}

export async function changeMemberSelectedColor(member: GuildMember, selectedColor: ColorRole) {
    const role = member.guild.roles.cache.get(selectedColor);
    if (!role) throw new CustomError("Role could not be resolved from ColorRole.", ErrorType.Error);

    const allColors = Object.values(ColorRole);

    const otherColors = allColors.filter(
        color => color !== selectedColor
    );

    try {

        if (otherColors.length > 0) {
            await member.roles.remove(otherColors);
        }

        await member.roles.add(role);

        return role;

    } catch (error) {
        throw new CustomError(`Failed to update color roles.`, ErrorType.Error, error as Error);
    }
}

export async function unsetMemberColor(member: GuildMember) {
    const allColors = Object.values(ColorRole);

    try {
        if (allColors.length > 0) {
            await member.roles.remove(allColors);
        }
    } catch (error) {
        throw new CustomError(`Failed to update color roles.`, ErrorType.Error, error as Error);
    }
}

export async function giveGroupPerms(member: GuildMember) {
    const role = member.guild.roles.cache.get(RoleId.GroupPerms);
    if (!role) throw new CustomError("Group Perms role could not be resolved", ErrorType.Error);

    try {
        await member.roles.add(role);
    } catch (error) {
        throw new CustomError(`Failed to update color roles.`, ErrorType.Error, error as Error);
    }
}