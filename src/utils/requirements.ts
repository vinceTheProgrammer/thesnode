import type { GuildMember } from "discord.js";
import { BadgeRole, GoodRoles } from "../constants/roles.js";
import type { SnUser } from "../types/SnUser.js";
import { findByDiscordId } from "./database.js";
import { getSnUser } from "./users.js";
import { GroupManagement } from "../types/SnGroup.js";
import { getSnGroup } from "./groups.js";
import { timeAgo } from "./dates.js";

export interface RequirementResult {
    success: boolean;  // Indicates if the requirement was met
    message: string;   // Describes whether the user met the requirement or not
}

export interface Requirement {
    evaluate(member: GuildMember, snUser?: SnUser): Promise<RequirementResult>;
}

export class AndRequirement implements Requirement {
    private requirements: Requirement[];

    constructor(...requirements: Requirement[]) {
        this.requirements = requirements;
    }

    async evaluate(member: GuildMember, snUser?: SnUser): Promise<RequirementResult> {
        const results: RequirementResult[] = [];

        for (const req of this.requirements) {
            const result = await req.evaluate(member, snUser);
            results.push(result);
            if (!result.success) {
                // If any requirement fails, the entire AND requirement fails
                return {
                    success: false,
                    message: `AND requirement failed:\n${results.map(r => r.message).join('\n')}`,
                };
            }
        }
        return {
            success: true,
            message: `All AND requirements passed:\n${results.map(r => r.message).join('\n')}`,
        };
    }
}

export class OrRequirement implements Requirement {
    private requirements: Requirement[];

    constructor(...requirements: Requirement[]) {
        this.requirements = requirements;
    }

    async evaluate(member: GuildMember, snUser?: SnUser): Promise<RequirementResult> {
        const results: RequirementResult[] = [];

        for (const req of this.requirements) {
            const result = await req.evaluate(member, snUser);
            results.push(result);
            if (result.success) {
                // If any requirement succeeds, the entire OR requirement succeeds
                return {
                    success: true,
                    message: `At least one OR requirement passed:\n${results.map(r => r.message).join('\n')}`,
                };
            }
        }
        return {
            success: false,
            message: `All OR requirements failed:\n${results.map(r => r.message).join('\n')}`,
        };
    }
}

export class HasRoleRequirement implements Requirement {
    private requiredRole: string;

    constructor(role: string) {
        this.requiredRole = role;
    }

    async evaluate(member: GuildMember): Promise<RequirementResult> {
        const hasRole = member.roles.cache.has(this.requiredRole);
        return {
            success: hasRole,
            message: hasRole
                ? `✅ User has the "${this.requiredRole}" role.`
                : `❌ User does not have the "${this.requiredRole}" role.`,
        };
    }
}

export class DiscordMemberBeforeDateRequirement implements Requirement {
    private date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    async evaluate(user: GuildMember): Promise<RequirementResult> {
        const joinedBefore = (user.joinedAt ?? this.date) < this.date;
        return {
            success: joinedBefore,
            message: joinedBefore
                ? `✅ User joined the server before ${timeAgo(this.date)}.`
                : `❌ User did not join the server before ${timeAgo(this.date)}.`,
        };
    }
}

export class HasAnySnBadgeRequirement implements Requirement {
    async evaluate(member: GuildMember): Promise<RequirementResult> {
        // Get an array of all badge role IDs directly from the BadgeRole enum
        const allBadgeRoles = Object.values(BadgeRole);

        // Check if the member has any of the badge roles
        for (const role of member.roles.cache) {
            const roleId = role[0];
            if (allBadgeRoles.includes(roleId as BadgeRole)) {
                return {
                    success: true, 
                    message: "✅ User has one or more required sn badges."
                };
            }
        }

        return {
            success: false, 
            message: "❌ User lacks any of the required sn badges."
        };
    }
}

export class SticknodesMemberBeforeDateRequirement implements Requirement {
    private date: Date;

    constructor(date: Date) {
        this.date = date;
    }

    async evaluate(member: GuildMember, snUser?: SnUser): Promise<RequirementResult> {
        let userJoinDate = this.date;

        if (!snUser) {
            const userDbEntry = await findByDiscordId(member.id);
            if (!userDbEntry) {
                return {
                    success: false,
                    message: "❌ No linked sticknodes.com account found; please link your account to meet this requirement."
                }
            }
            const snUsername = userDbEntry.snUsername;
            if (!snUsername) {
                return {
                    success: false,
                    message: "❌ No linked sticknodes.com account found; please link your account to meet this requirement."
                }
            }
            const _snUser = await getSnUser(snUsername);

            userJoinDate = _snUser.stats.joinDate ?? this.date;
        } else {
            userJoinDate = snUser.stats.joinDate ?? this.date;
        }

        const joinedBefore = userJoinDate < this.date;
        return {
            success: joinedBefore,
            message: joinedBefore
                ? `✅ User joined sticknodes.com before ${timeAgo(this.date)}.`
                : `❌ User did not join sticknodes.com before ${timeAgo(this.date)}.`,
        };
    }
}

export class HasGroupMemberCountGENumber implements Requirement {
    private minimum: number;

    constructor(minimum: number) {
        this.minimum = minimum;
    }
    async evaluate(member: GuildMember, snUser?: SnUser): Promise<RequirementResult> {
        if (!snUser) {
            const userDbEntry = await findByDiscordId(member.id);
            if (!userDbEntry) {
                return {
                    success: false,
                    message: "❌ No linked sticknodes.com account found; please link your account to meet this requirement."
                }
            }
            const snUsername = userDbEntry.snUsername;
            if (!snUsername) {
                return {
                    success: false,
                    message: "❌ No linked sticknodes.com account found; please link your account to meet this requirement."
                }
            }
           snUser = await getSnUser(snUsername);
        }

        if (snUser.id === 0) {
            return {
                success: false,
                message: "❌ No valid sticknodes.com user found; this may be an error."
            }
        }

        const groups = snUser.managedGroups.filter(group => group.management === GroupManagement.Owner);

        for (const groupPreview of groups) {
            const group = await getSnGroup(groupPreview.id, true);
            const memberCount = group.stats.memberCount;

            if (memberCount >= this.minimum) {
                return {
                    success: true,
                    message: `✅ Owned group "${group.name}" meets the member count requirement with ${memberCount} members (minimum ${this.minimum} required).`
                }
            }
        }

        return {
            success: false,
            message: `❌ No owned groups meet the minimum member count requirement of ${this.minimum} members.`
        }

    }

}