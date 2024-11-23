import { Listener } from '@sapphire/framework';
import { AttachmentBuilder, EmbedBuilder, type Client, type GuildMember, type PartialGuildMember } from 'discord.js';
import { ChannelId } from '../constants/channels.js';
import { welcomeGifs, welcomeVariants } from '../constants/welcomeMessages.js';
import { createNoticesThread } from '../utils/threads.js';
import { getImagePath } from '../utils/assets.js';
import { MessageBuilder } from '@sapphire/discord.js-utilities';

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

        const file = new AttachmentBuilder(getImagePath(welcomeGif));

        const embed = new EmbedBuilder()
        .setDescription(welcomeMessage)
        .setImage(`attachment://${welcomeGif}`)

        const gifMessage = new MessageBuilder()
        .addFile(file)
        .setEmbeds([embed])
        .setAllowedMentions({parse: []})

        channel.send(gifMessage).then(message => {
            createNoticesThread(message, `Welcome ${newMember.user.displayName}`);
        });
    }
}
