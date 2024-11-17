import type { Message, StartThreadOptions } from "discord.js";

export async function createNoticesThread(message: Message, name: string) {
    const options : StartThreadOptions = {
        name: name,
        rateLimitPerUser: 15,
        reason: "DemonBot auto thread"
    }
    console.log("test");
    message.startThread(options);
}
