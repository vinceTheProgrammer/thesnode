import TurndownService from 'turndown';
import { decode } from 'html-entities';
import { BadgeRole, ColorToRoleIdMap, type ColorRole } from '../constants/roles.js';
import { CustomError } from './errors.js';
import { ErrorType } from '../constants/errors.js';

export function generateKey(length = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < length; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
}

export function htmlToMarkdown(text: string) {
    const turndownService = new TurndownService();

    const decodedHTML = decode(text);
    const markdown = turndownService.turndown(decodedHTML);

    return markdown;
}

export function formatEnumNameCapitalSpaced(name: string): string {
    // Format enum name from CamelCase to a more readable form (e.g., FunBlue -> Fun Blue)
    return name.replace(/([a-z])([A-Z])/g, '$1 $2');
}

export function formatEnumNameLowerDashed(name: string): string {
    return formatEnumNameCapitalSpaced(name).toLowerCase().replace(' ', '-');
}

export function roleIdsToRoleMentions(roleIds: string[]) {
    if (roleIds.length == 0) throw new CustomError('roleIds array is empty! cannot create discord role mentions!', ErrorType.Error);

    return roleIds.map(role => `<@&${role}>`);
}

export function colorRoleIdsToRoleMentionsWithRequirements(colors: ColorRole[]) {
    if (colors.length == 0) throw new CustomError('colors array is empty! cannot create discord role mentions!', ErrorType.Error);

    return colors.map(color => {

        let requiredRolesString = '???';

        const requiredRoles = ColorToRoleIdMap[color];

        if (requiredRoles.length > 0) {
            const badgeRoleKey = Object.keys(BadgeRole).find(key => BadgeRole[key as keyof typeof BadgeRole] === requiredRoles[0]);
            if (badgeRoleKey) {
                requiredRolesString = badgeRoleKey;
                if (requiredRoles.length > 1) requiredRolesString += '+';
            }
        }


        return `<@&${color}> - (${requiredRolesString})`;
    });
}

export function dbUsersToDiscordMentions(users: {
    discordId: string;
    birthday: Date | null;
}[]) {
    if (users.length == 0) throw new Error('users array is empty! cannot discord mentions from db users!');

    return users.map(user => `<@${user.discordId}>`);
}

export function formatUserList(users: string[]): string {
    if (users.length === 0) return "";
    if (users.length === 1) return `${users[0]}`; // Single user case
    if (users.length === 2) return `${users[0]} and ${users[1]}`; // Special case for two users
    const lastUser = users.pop(); // Remove the last user
    return `${users.join(", ")}, and ${lastUser}`; // Join remaining users with commas
  }