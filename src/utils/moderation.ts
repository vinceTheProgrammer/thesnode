import type { User } from "discord.js";
import type { SnUser } from "../types/SnUser.js";
import { isBirthdayWithinTos } from "./dates.js";
import { ChannelId } from "../constants/channels.js";
import { sendAlert } from "./messages.js";

export async function checkBirthdayIsWithinTos(snUser: SnUser, discordUser: User) : Promise<void> {
    if (snUser.socials.birthday == null) return;
    const withinTos = isBirthdayWithinTos(snUser.socials.birthday);

    const message = `Discord user <@${discordUser.id}> just linked SN user **${snUser.username}**, which has a birthday that would put them as being under 13 years old.`;

    if (!withinTos) sendAlert(ChannelId.ModTalk, message);
}