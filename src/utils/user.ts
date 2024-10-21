import * as cheerio from 'cheerio';
import type { SnUser } from '../types/types.js';
import { DEFAULT_USER } from '../constants/defaults.js';
import { getSnUserStatsFromHtml, getSnUserSocialsFromHtml, updateSnUserBasicDataFromHtml, getSnUserManagedGroupsFromHtml, getSnUserTrophiesFromHtml, getSnUserBadgesFromHtml, getSnUserAdminCountFromManagedGroups, getSnUserModCountFromManagedGroups, getSnUserOwnerCountFromManagedGroups} from './webscraping.js'
import { CustomError, ErrorType } from './errors.js';

export async function getSnUser(username: string, bypassCache: boolean = false): Promise<SnUser> {
    let snUser : SnUser = { ...DEFAULT_USER};
    try {
        const url = bypassCache 
            ? `https://sticknodes.com/members/${username}/profile?timestamp=${Date.now()}` 
            : `https://sticknodes.com/members/${username}/profile`;

        const fetchOptions: RequestInit = bypassCache
            ? {
                cache: 'no-cache',
                method: 'GET',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0',
                },
              }
            : { method: 'GET' }; // Standard fetch options without cache busting

        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            if (response.status === 404) {
                console.warn(`User ${username} not found (404).`);
                return snUser; // Return the default user if 404
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            snUser.fetchDate = new Date(lastModified);
        }

        const html = await response.text();

        const $ = cheerio.load(html);

        snUser = updateSnUserBasicDataFromHtml(snUser, html);

        if (snUser.username === "demonbot") {
            snUser.id = 99999999;
            return snUser;
        }

        snUser.stats = getSnUserStatsFromHtml(html);
        snUser.socials = getSnUserSocialsFromHtml(html);
        snUser.badges = getSnUserBadgesFromHtml(html);
        snUser.trophies = getSnUserTrophiesFromHtml(html);
        snUser.managedGroups = getSnUserManagedGroupsFromHtml(html);
        snUser.ownerCount = getSnUserOwnerCountFromManagedGroups(snUser.managedGroups);
        snUser.adminCount = getSnUserAdminCountFromManagedGroups(snUser.managedGroups);
        snUser.modCount = getSnUserModCountFromManagedGroups(snUser.managedGroups);

    } catch (error) {
        throw new CustomError("Error fetching or parsing user page. (user.ts)", ErrorType.Error,  error as Error);
    }

    return snUser;
}