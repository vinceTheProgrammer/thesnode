import ky from 'ky';
import * as cheerio from 'cheerio';
import type { SnUser } from '../types/types.js';
import { DEFAULT_USER } from '../constants/defaults.js';
import { getSnUserStatsFromHtml, getSnUserSocialsFromHtml, updateSnUserBasicDataFromHtml, getSnUserManagedGroupsFromHtml, getSnUserTrophiesFromHtml, getSnUserBadgesFromHtml} from './webscraping.js'

export async function getSnUser(username: string): Promise<SnUser> {
    let snUser : SnUser = { ...DEFAULT_USER};
    try {
        const html = await ky.get(`https://sticknodes.com/members/${username}/profile`).text();

        const $ = cheerio.load(html);

        snUser = updateSnUserBasicDataFromHtml(snUser, html);
        snUser.stats = getSnUserStatsFromHtml(html);
        snUser.socials = getSnUserSocialsFromHtml(html);
        snUser.badges = getSnUserBadgesFromHtml(html);
        snUser.trophies = getSnUserTrophiesFromHtml(html);
        snUser.managedGroups = getSnUserManagedGroupsFromHtml(html);

    } catch (error) {
        console.error('Error fetching or parsing page:', error);
    }
    return snUser;
}