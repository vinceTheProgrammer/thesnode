import { Listener } from '@sapphire/framework';
import type { Message } from 'discord.js';
import { incrementMessageCount, logMessage } from '../utils/database.js';

export class MessageCreate extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'messageCreate'
        });
    }

    override run(message: Message) {
        logMessage(message.author.id);
    }
}