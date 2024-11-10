import type { Message, StartThreadOptions } from "discord.js";

export async function createNoticesThread(message: Message) {
    const options : StartThreadOptions = {
        name: "Discussion",
        rateLimitPerUser: 15,
        reason: "DemonBot auto thread"
    }
    console.log("test");
    message.startThread(options);
}