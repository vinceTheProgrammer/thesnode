import { type GuildMember, userMention } from "discord.js";

export const welcomeVariants = [
    (member: GuildMember) =>
        `${userMention(member.id)} has joined the server.`
];

export const welcomeGifs = [
    'https://tenor.com/view/yakuza-ps3-gif-door-gif-7633523',
];