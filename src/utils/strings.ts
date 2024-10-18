import TurndownService from 'turndown';
import {decode} from 'html-entities';

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