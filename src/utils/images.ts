import getPixels from 'get-pixels';
import { extractColors } from 'extract-colors';

const BASE_AVATAR_URL = 'https://sticknodes.com/wp-content/themes/dw-minion/assets/img/wpsn/default-avatars/';

/**
 * Returns the URL of a specific default avatar.
 * @param {number} index - The avatar index (1 to 12).
 * @returns {string} The URL of the specified avatar.
 */
export function getDefaultAvatarUrl(index: number): string {
    if (index < 1 || index > 12) {
        throw new Error('Avatar index must be between 1 and 12');
    }
    const paddedIndex = String(index).padStart(2, '0'); // Ensure the index is 2 digits (e.g., 01, 02).
    return `${BASE_AVATAR_URL}${paddedIndex}.png`;
}

/**
 * Returns the URL of a random default avatar.
 * @returns {string} The URL of a random avatar.
 */
export function getRandomDefaultAvatarUrl(): string {
    const randomIndex = Math.floor(Math.random() * 12) + 1; // Generate a number between 1 and 12.
    return getDefaultAvatarUrl(randomIndex);
}

/**
 * Fetch the accent color from an image URL.
 * @param {string} imageUrl - URL of the image to extract color from.
 * @returns {Promise<string>} - The hex color or "#000000" on failure.
 */
export async function getAccentColorFromUrl(imageUrl: string): Promise<string> {

    return new Promise((resolve, reject) => {
        try {
            // Read the image data using get-pixels
            getPixels(imageUrl, async (err, pixels) => {
                if (err) throw(err);
                const data = [...pixels.data];
                const [width, height] = pixels.shape;
    
                // Extract the color palette from the image data
                const colors = await extractColors({ data, width, height });

                const sortedColors = colors.sort((a, b) => b.area - a.area);

                const secondLargestArea = sortedColors[1];
    
                // Return the first color's hex, or black if no colors were extracted
                resolve(secondLargestArea ? secondLargestArea.hex : '#000000');
            });
        } catch (error) {
            console.error('Error:', error);
            resolve('#000000'); // Return black on any error
        }
    });
}
