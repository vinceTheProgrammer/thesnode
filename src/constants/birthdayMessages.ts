export const titleVariants = [
    "Guess who?",
    "You won’t believe it",
    "If I may, attention",
    "Wow!",
    "It’s that special time again..."
];

export const descriptionVariants = [
    (users: string[], isPlural: boolean) =>
        `It’s time to party, mortals. 🎉 Today, we celebrate the existence of: ${users.join(", ")}. ` +
        `You’ve officially survived another year${isPlural ? "s" : ""}. Try not to get too smug about it.`,

    (users: string[], isPlural: boolean) =>
        `Some very compelling developments. ${users.join(", ")} ${isPlural ? "have" : "has"} leveled up in the game of life. ` +
        `Another trip around the sun, completed with style. Birthday cake is mandatory. 🥳`,

    (users: string[], isPlural: boolean) =>
        `More significant milestones detected. ${users.join(", ")} ${isPlural ? "are" : "is"} having ${isPlural ? "their" : "a"} birthday today! 🎂 ` +
        `Statistically, this is extremely fortunate... or maybe it’s just math. Either way, get to celebrating.`,

    (users: string[], isPlural: boolean) =>
        `Prepare your party hats. ${users.join(", ")} ${isPlural ? "are" : "is"} officially older and (hopefully) wiser. 🥂 ` +
        `Everyone else, I expect an appropriate amount of fanfare and emojis.`
];
