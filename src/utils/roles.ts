import { GuildMember, Role } from "discord.js";
import type { SnUser } from "../types/types.js";
import { BADGE_TO_ROLE, BadgeRole, ColorRole, ColorToBadgeMap } from "../constants/roles.js";
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

    } catch (error) {
        throw new CustomError(`Failed to sync roles for ${snUser.username}:`, ErrorType.Error, error as Error);
    }
}

export function getUnlockedColors(member: GuildMember): ColorRole[] {
    const unlockedColors = new Set<ColorRole>(); // Use Set to avoid duplicates

    for (const [color, badges] of Object.entries(ColorToBadgeMap) as [ColorRole, BadgeRole[]][]) {
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