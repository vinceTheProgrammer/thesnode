import { Listener } from '@sapphire/framework';
import type { Client, GuildMember, PartialGuildMember } from 'discord.js';
import { ChannelId } from '../constants/channels.js';
import { welcomeGifs, welcomeVariants } from '../constants/welcomeMessages.js';

export class GuildMemberUpdate extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildMemberUpdate'
        });
    }

    override run(oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) {
        if (!(oldMember.pending === true && newMember.pending === false)) return;

        const channel = this.container.client.channels.cache.get(ChannelId.WelcomeMessage);
        if (!channel) return;
        if (!channel.isSendable()) return;

        const welcomeVariant = welcomeVariants[Math.floor(Math.random() * welcomeVariants.length)];
        if (!welcomeVariant) return;

        const welcomeMessage = welcomeVariant(newMember);

        const welcomeGif = welcomeGifs[Math.floor(Math.random() * welcomeGifs.length)];
        if (!welcomeGif) return;

        channel.send({content: welcomeMessage, allowedMentions: {parse: []}}).then(() => {channel.send({content: welcomeGif})});
    }
}