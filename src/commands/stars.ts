import { Command } from '@sapphire/framework';
import { ChannelType, ChatInputCommandInteraction, EmbedBuilder, ForumChannel } from 'discord.js';
import { ChannelId } from '../constants/channels.js';

export class StarsCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'stars',
            description: 'Fetch the top 5 posts with the most star reactions in a forum channel from the last week.',
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
          builder
            .setName(this.name)
            .setDescription(this.description),
          { idHints: ['1310154330627903509'] }
        );
      }

    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ephemeral: true});

        // Ensure the interaction is in a guild
        if (!interaction.guild) {
            return interaction.editReply({ content: 'This command can only be used in a server.' });
        }

        // Ensure the channel is a forum channel
        const forumChannel = this.container.client.channels.cache.get(ChannelId.Showoff);
        if (!forumChannel || forumChannel.type !== ChannelType.GuildForum) {
            return interaction.editReply({ content: 'The hardcoded channel is not a forum channel. (Blame Vince)' });
        }

        // Calculate the date one week ago
        const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

        // Get threads created in the last 7 days
        const threads = await forumChannel.threads.fetchActive();
        const recentThreads = threads.threads.filter(thread => thread.createdAt && thread.createdAt.getTime() >= oneWeekAgo);

        if (!recentThreads.size) {
            return interaction.editReply({ content: 'No recent threads found within the last week.' });
        }

        // Calculate star reactions for each thread
        const starCounts = await Promise.all(
            recentThreads.map(async (thread) => {
                const messages = await thread.messages.fetch();
                let starCount = 0;

                messages.forEach(message => {
                    const starReaction = message.reactions.cache.get('⭐');
                    if (starReaction) {
                        starCount += starReaction.count;
                    }
                });

                return { thread, starCount };
            })
        );

        // Sort by star count and get top 5
        const topThreads = starCounts
            .sort((a, b) => b.starCount - a.starCount)
            .slice(0, 5);

        const description = topThreads.length
            ? topThreads.map(({ thread, starCount }, index) =>
                `**#${index + 1}:** [${thread.name}](${thread.url}) - ⭐ **${starCount} stars**`
            ).join('\n')
            : '';



        const title =  topThreads.length
            ? 'Most stars in past 7 days'
            : 'No threads with star reactions found in the past week.';

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)

        await interaction.editReply({ embeds: [embed] });
    }
}