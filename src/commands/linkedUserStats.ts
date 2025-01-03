import { Command } from '@sapphire/framework';
import { ChannelType, ForumChannel, AttachmentBuilder, ChannelFlags, EmbedBuilder } from 'discord.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { ErrorType } from '../constants/errors.js';
import { parseEmbeds } from '../utils/embeds.js';
import { getAttachments } from '../utils/attachments.js';
import { parseComponents } from '../utils/components.js';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { getTotalLinkedUserCount, getTotalUnlinkedUserCount, getTotalUserCount } from '../utils/database.js';
import { RoleId } from '../constants/roles.js';

export class LinkedUserStatsCommand extends Command {
    public constructor(context: Command.Context, options: Command.Options) {
        super(context, {
            ...options,
            name: 'linked-user-stats',
            description: 'Check statistics for linked users.',
            preconditions: ['StaffOnly']
        });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description),
                //{ idHints: ['1309806191735603261'] }
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ephemeral: true});

            const guild = interaction.guild;

            if (!guild) throw new CustomError("Please use this command within a server. (guild cannot be determined).", ErrorType.Error);

            let memberRole = guild.roles.cache.get(RoleId.Linked);

            if (!memberRole) throw new CustomError("Member role is not defined. Likely a bad hardcoded ID, so blame Vince.", ErrorType.Error);

            const memberCount = (await interaction.guild.members.fetch()).filter(member => !member.user.bot).size;
            const trackedUsersCount = await getTotalUserCount();
            const linkedUserCount = await getTotalLinkedUserCount();
            const unlinkedUserCount = await getTotalUnlinkedUserCount();
            const memberWithMemberRoleCount = memberRole.members.filter(member => !member.user.bot).size;

            const statsEmbed = new EmbedBuilder()
                .setTitle("Linked User Stats")
                .addFields([
                    {
                        name: 'Total Members',
                        value: `${memberCount}`,
                        inline: true
                    },
                    {
                        name: 'Tracked Users (has database entry)',
                        value: `${trackedUsersCount}`,
                        inline: true
                    },
                    {
                        name: 'Linked Members',
                        value: `${linkedUserCount}`,
                        inline: true
                    }, 
                    {
                        name: 'Unlinked Members (tracked)',
                        value: `${unlinkedUserCount}`,
                        inline: true
                    },
                    {
                        name: 'Unlinked Members (calculated)',
                        value: `${memberCount - linkedUserCount}`,
                        inline: true
                    },
                    {
                        name: 'With Member Role',
                        value: `${memberWithMemberRoleCount}`,
                        inline: true
                    },
                    {
                        name: 'Without Member Role',
                        value: `${memberCount - memberWithMemberRoleCount}`,
                        inline: true
                    },
                    // {
                    //     name: 'Users in limbo',
                    //     value: `${}`,
                    //     inline: true
                    // },
                    // {
                    //     name: 'Unauthorized users',
                    //     value: `${}`,
                    //     inline: true
                    // }
                ]);

                // const limboUsersEmbed = new EmbedBuilder()
                //     .setTitle("Users in limbo (linked but no member role)")
                //     .setDescription(`${}`);

                // const unauthorizedUsersEmbed = new EmbedBuilder()
                //     .setTitle("Unauthorized users (not linked but has member role")
                //     .setDescription(`${}`);

                const message = new MessageBuilder()
                    .setEmbeds([statsEmbed])
            

            return interaction.editReply(message);

        } catch (error) {
            handleCommandError(interaction, error);
        }
    }
}
