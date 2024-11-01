import { DEFAULT_GROUP } from "../constants/defaults.js";
import { ErrorType } from "../constants/errors.js";
import type { SnGroup } from "../types/types.js";
import { CustomError } from "./errors.js";
import { getSnGroupAdminsFromHtml, getSnGroupModsFromHtml, getSnGroupStatsFromHtml, updateSnGroupBasicDataFromHtml } from "./webscraping.js";

export async function getSnGroup(groupId: string, bypassCache: boolean = false): Promise<SnGroup> {

    let snGroup: SnGroup = { ...DEFAULT_GROUP };

    const url = bypassCache
        ? `https://sticknodes.com/groups/${groupId}?timestamp=${Date.now()}`
        : `https://sticknodes.com/groups/${groupId}`;

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

    try {
        const response = await fetch(url, fetchOptions);

        if (!response.ok) {
            if (response.status === 404) {
                throw new CustomError(`Group "${groupId} not found."`, ErrorType.Error);
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const lastModified = response.headers.get('Last-Modified');
        if (lastModified) {
            snGroup.fetchDate = new Date(lastModified);
        }

        const html = await response.text();

        snGroup.id = groupId;

        snGroup = updateSnGroupBasicDataFromHtml(snGroup, html);

        snGroup.stats = getSnGroupStatsFromHtml(html);

        if (snGroup.public) {
            snGroup.admins = getSnGroupAdminsFromHtml(html);
            snGroup.mods = getSnGroupModsFromHtml(html);
        }

    } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError("Error fetching or parsing group page. (groups.ts)", ErrorType.Error, error as Error);
    }

    return snGroup;
}