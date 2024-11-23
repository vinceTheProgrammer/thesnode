import { Command } from '@sapphire/framework';
import { ApplicationCommandOptionType, ChannelType, type TextBasedChannel, ForumChannel, AttachmentBuilder, ChannelFlags } from 'discord.js';

export class CreateMessageCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'edit-message',
            description: 'Edits an existing message.',
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
                        .setDescription('The channel containing the message to edit.')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('message-id')
                        .setDescription('The ID of the message to edit.')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('content')
                        .setDescription('The new content for the message.')
                        .setRequired(false)
                )
                .addStringOption((option) =>
                    option
                        .setName('embeds')
                        .setDescription('The new embeds for the message in JSON format.')
                        .setRequired(false)
                )
                .addAttachmentOption((option) =>
                    option
                        .setName('files')
                        .setDescription('New file(s) to attach to the message.')
                        .setRequired(false)
                ),
                { idHints: ['1309806193740353556'] }
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const channel = interaction.options.getChannel('channel', true);
        const messageId = interaction.options.getString('message-id', true); // Message ID to edit
        const content = interaction.options.getString('content') ?? undefined;
        const rawEmbeds = interaction.options.getString('embeds');
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

        // Ensure the channel is a text-based channel
        if (!(channel.type === ChannelType.GuildText || 
            channel.type === ChannelType.GuildAnnouncement || 
            channel.type === ChannelType.PublicThread || 
            channel.type === ChannelType.PrivateThread)) {
            return interaction.reply({
                content: 'The provided channel is not a text-based channel.',
                ephemeral: true,
            });
        }

        try {
            // Fetch the message to edit
            const targetChannel = channel as TextBasedChannel;
            const message = await targetChannel.messages.fetch(messageId);
    
            if (!message) {
                return interaction.reply({
                    content: 'Message not found. Please provide a valid message ID.',
                    ephemeral: true,
                });
            }
    
            if (!message.editable) {
                return interaction.reply({
                    content: 'This message cannot be edited.',
                    ephemeral: true,
                });
            }
    
            // Edit the message
            await message.edit({
                content: content ?? null, // If no content provided, clear it
                embeds: embeds ?? [], // Replace embeds if provided
                files: files ?? [],   // Replace files if provided
            });
    
            return interaction.reply({
                content: `Message successfully edited in ${channel.name}.`,
                ephemeral: true,
            });
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Failed to edit the message. Please check the details and try again.',
                ephemeral: true,
            });
        }
    }

}
