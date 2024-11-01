import { formatUserList } from "../utils/strings.js";

export const titleVariants = [
    "Guess who?",
    "You won’t believe it",
    "If I may, attention",
    "Wow!",
    "It’s that special time again...",
    "Critical Update",
    "This Just In",
    "Breaking News",
    "Attention, Everyone",
    "Guess What?",
    "Wow, Unbelievable",
    "Compelling Developments",
    "You’ll Never Guess Who",
    "Sound the Alarms",
    "The Stars Have Aligned"
];

export const descriptionVariants = [
    (users: string[], isPlural: boolean) =>
        `It’s time to party, mortals. 🎉 Today, we celebrate the existence of: ${formatUserList(users)}. ` +
        `You’ve officially survived another year. Try not to get too smug about it.`,

    (users: string[], isPlural: boolean) =>
        `Some very compelling developments. ${formatUserList(users)} ${isPlural ? "have" : "has"} leveled up in the game of life. ` +
        `Another trip around the sun, completed with style. Birthday cake is mandatory. 🥳`,

    (users: string[], isPlural: boolean) =>
        `More significant milestones detected. ${formatUserList(users)} ${isPlural ? "are" : "is"} having ${isPlural ? "their" : "a"} birthday today! 🎂 ` +
        `Statistically, this is extremely fortunate... or maybe it’s just math. Either way, get to celebrating.`,

    (users: string[], isPlural: boolean) =>
        `Prepare your party hats. ${formatUserList(users)} ${isPlural ? "are" : "is"} officially older and (hopefully) wiser. 🥂 ` +
        `Everyone else, I expect an appropriate amount of fanfare and emojis.`,
    (users: string[], isPlural: boolean) =>
        `Breaking news! ${formatUserList(users)} ${isPlural ? "have" : "has"} entered a new age tier. ` +
        `Another birthday on the board. Keep it together, folks. 🎉`,

    (users: string[], isPlural: boolean) =>
        `The prophecy was true! ${formatUserList(users)} ${isPlural ? "are" : "is"} celebrating today. ` +
        `Make sure to remind them how old they’re getting. 🕰️`,

    (users: string[], isPlural: boolean) =>
        `Compelling developments detected. ${formatUserList(users)} ${isPlural ? "are" : "is"} officially aging! ` +
        `Statistics suggest cake consumption is imminent. 🍰`,

    (users: string[], isPlural: boolean) =>
        `It's a birthday event! ${formatUserList(users)} ${isPlural ? "have" : "has"} reached a new level of existence. ` +
        `Reward them with emojis and sarcastic comments. 🎁`,

    (users: string[], isPlural: boolean) =>
        `Attention, world: ${formatUserList(users)} ${isPlural ? "are" : "is"} celebrating today. ` +
        `Birthday protocol requires at least one “🎉” per attendee. Don't disappoint.`,

    (users: string[], isPlural: boolean) =>
        `Well, well, well... looks like ${formatUserList(users)} ${isPlural ? "have" : "has"} leveled up again. ` +
        `What do they win? Existential dread—and cake. 🎂`,

    (users: string[], isPlural: boolean) =>
        `Confirmed sighting: ${formatUserList(users)} ${isPlural ? "are" : "is"} getting older today. ` +
        `A moment of silence for their youth. Or better yet—louder celebrations. 🎊`,

    (users: string[], isPlural: boolean) =>
        `All systems report: ${formatUserList(users)} ${isPlural ? "are" : "is"} another year wiser (hopefully). ` +
        `Be sure to file your official “Happy Birthday” response promptly.`,

    (users: string[], isPlural: boolean) =>
        `This just in—aging detected! ${formatUserList(users)} ${isPlural ? "are" : "is"} officially another year older. ` +
        `The celebrations are unavoidable. Engage accordingly. 🥳`,

    (users: string[], isPlural: boolean) =>
        `Prepare the confetti! ${formatUserList(users)} ${isPlural ? "have" : "has"} unlocked a new year! ` +
        `Time to equip those party hats and level up the fun. 🎈`,

    (users: string[], isPlural: boolean) =>
        `Important discovery: ${formatUserList(users)} ${isPlural ? "are" : "is"} marking another trip around the sun. ` +
        `Your mission: Send some birthday cheer, or else. 🚀`,

    (users: string[], isPlural: boolean) =>
        `Age increment successful! ${formatUserList(users)} ${isPlural ? "are" : "is"} moving up the leaderboard of life. ` +
        `Proceed to celebration zone immediately. 🎉`,

    (users: string[], isPlural: boolean) =>
        `Guess what? ${formatUserList(users)} ${isPlural ? "have" : "has"} managed to survive another year! ` +
        `Be sure to congratulate them—it’s the least you can do.`,

    (users: string[], isPlural: boolean) =>
        `Incredible! ${formatUserList(users)} ${isPlural ? "are" : "is"} still standing. ` +
        `One more year under their belt. Send the obligatory emojis now.`,

    (users: string[], isPlural: boolean) =>
        `Official alert: ${formatUserList(users)} ${isPlural ? "are" : "is"} entering a new age threshold. ` +
        `No turning back now—celebrate or get left behind.`
];

export const emojiVariants = [
    "🎉", "🥳", "🎂", "🎁", "🍰", "🎈", "🕺", "💃", "🎊", "🍻", "🥂",
    "🍾", "✨", "😎",
    "🙌", "🔥", "🚀"
];


export function getReactionEmoji(message: string): string {
    const emojiRegex = /(\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const foundEmoji = message.match(emojiRegex);
    if (foundEmoji) {
        return foundEmoji[0]; // Use the emoji found in the message
    }
    // Fallback to a random emoji if no emoji is found
    return emojiVariants[Math.floor(Math.random() * emojiVariants.length)] ?? '🎉';
}