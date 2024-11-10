import { type GuildMember, userMention } from "discord.js";

export const welcomeVariants = [
    (member: GuildMember) =>
        `${userMention(member.id)} has joined the server.`
];

export const welcomeGifs = [
    'yakuza-ps3_sd.gif',
];