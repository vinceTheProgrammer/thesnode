import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType, ChannelType, type TextBasedChannel, ForumChannel, AttachmentBuilder, ChannelFlags } from 'discord.js';

export class CreateMessageCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'create-message',
            description: 'Creates a message or post in a specified channel.',
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
                .addChannelOption((option) =>
                    option
                        .setName('channel')
                        .setDescription('The channel to send the message in or create a post at.')
                        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildForum, ChannelType.PublicThread, ChannelType.PrivateThread)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option.setName('content').setDescription('The content of the message').setRequired(false)
                )
                .addStringOption((option) =>
                    option.setName('embeds').setDescription('JSON stringified embed(s) array').setRequired(false)
                )
                .addAttachmentOption((option) =>
                    option.setName('files').setDescription('Attach file(s) to the message').setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('post-title')
                        .setDescription('The title for the forum post (only for forum channels)')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('post-tag')
                        .setDescription('The tag for the forum post (only for forum channels)')
                        .setRequired(false)
                )
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel', true);
        const content = interaction.options.getString('content') ?? undefined;
        const rawEmbeds = interaction.options.getString('embeds');
        const postTitle = interaction.options.getString('post-title');
        const tagName = interaction.options.getString('post-tag'); // Tag provided by the user
        const fileAttachment = interaction.options.getAttachment('files');

        // Helper functions for color and timestamp conversion
        const convertHexToInt = (hex: string) => parseInt(hex.replace(/^#/, ''), 16);
        const convertEpochToISO8601 = (epoch: number) => new Date(epoch).toISOString();

        // Parse embeds if provided
        let embeds;
        if (rawEmbeds) {
            try {
                const parsed = JSON.parse(rawEmbeds);
                const embedArray = Array.isArray(parsed) ? parsed : [parsed];

                embeds = embedArray.map((embed: any) => {
                    if (embed.color && typeof embed.color === 'string') {
                        embed.color = convertHexToInt(embed.color);
                    }
                    if (embed.timestamp && typeof embed.timestamp === 'number') {
                        embed.timestamp = convertEpochToISO8601(embed.timestamp);
                    }
                    return embed;
                });
            } catch (error) {
                return interaction.reply({
                    content: 'Invalid embed JSON provided. Please ensure it is properly formatted.',
                    ephemeral: true,
                });
            }
        }

        const files = fileAttachment ? [new AttachmentBuilder(fileAttachment.url)] : undefined;

        if (channel.type === ChannelType.GuildForum) {
            if (!postTitle) {
                return interaction.reply({
                    content: 'A title is required for creating posts in forum channels.',
                    ephemeral: true,
                });
            }

            const forumChannel = channel as ForumChannel;

            // Check if tags are required in this forum channel
            const requiresTag = forumChannel.flags.has(ChannelFlags.RequireTag);

            // Find the tag provided by the user (if any)
            const selectedTag = forumChannel.availableTags.find(
                (tag) => tag.name.toLowerCase() === tagName?.toLowerCase()
            );

            console.log(selectedTag);

            // If tags are required and the user didn't provide a valid tag, send an error
            if (requiresTag && !selectedTag) {
                return interaction.reply({
                    content: `This forum channel requires a tag to create a post. Please specify a valid tag from the following options: ${forumChannel.availableTags
                        .map((tag) => `\`${tag.name}\``)
                        .join(', ')}`,
                    ephemeral: true,
                });
            }

            try {
                // Create the post with the selected tag (if provided)
                await forumChannel.threads.create({
                    name: postTitle,
                    message: {
                        content,
                        embeds,
                        files,
                    },
                    appliedTags: selectedTag ? [selectedTag.id] : [],
                });

                return interaction.reply({ content: `Post created in ${channel.name}.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'Failed to create a post in the forum channel. Please check the details and try again.',
                    ephemeral: true,
                });
            }
        } else if (
            channel.type === ChannelType.GuildText || 
            channel.type === ChannelType.GuildAnnouncement || 
            channel.type === ChannelType.PublicThread || 
            channel.type === ChannelType.PrivateThread
        ) {
            try {
                // Cast channel to a sendable type
                const textChannel = channel as Extract<
                    typeof channel,
                    { send: (options: any) => Promise<any> }
                >;
    
                await textChannel.send({ content, embeds, files });
                return interaction.reply({ content: `Message sent to ${channel.name}.`, ephemeral: true });
            } catch (error) {
                console.error(error);
                return interaction.reply({
                    content: 'Failed to send the message. Please check the details and try again.',
                    ephemeral: true,
                });
            }
        } else {
            return interaction.reply({
                content: 'This command is designed to work in forum channels.',
                ephemeral: true,
            });
        }
    }

}
