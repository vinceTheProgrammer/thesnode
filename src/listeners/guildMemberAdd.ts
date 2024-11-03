import { Listener } from '@sapphire/framework';
import type { Client, GuildMember } from 'discord.js';
import { ChannelId } from '../constants/channels.js';
import { welcomeVariants } from '../constants/welcomeMessages.js';
import { Link } from '../constants/links.js';

export class GuildMemberAdd extends Listener {
    public constructor(context: Listener.LoaderContext, options: Listener.Options) {
        super(context, {
            ...options,
            event: 'guildMemberAdd'
        });
    }

    override run(member: GuildMember) {
        const channel = this.container.client.channels.cache.get(ChannelId.WelcomeMessage);
        if (!channel) return;
        if (!channel.isSendable()) return;

        const welcomeVariant = welcomeVariants[Math.floor(Math.random() * welcomeVariants.length)];
        if (!welcomeVariant) return;

        const welcomeMessage = welcomeVariant(member);

        channel.send({content: welcomeMessage, allowedMentions: {parse: []}}).then(() => {channel.send({content: Link.WelcomeGif})});
    }
}