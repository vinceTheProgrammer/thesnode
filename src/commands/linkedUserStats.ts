import { Command } from '@sapphire/framework';
import { ChannelType, ForumChannel, AttachmentBuilder, ChannelFlags, EmbedBuilder } from 'discord.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { ErrorType } from '../constants/errors.js';
import { parseEmbeds } from '../utils/embeds.js';
import { getAttachments } from '../utils/attachments.js';
import { parseComponents } from '../utils/components.js';
import { MessageBuilder } from '@sapphire/discord.js-utilities';
import { getLinkedUsersFromMembers, getTotalLinkedUserCount, getTotalUnlinkedUserCount, getTotalUserCount, getUnlinkedUsersFromMembers } from '../utils/database.js';
import { RoleId } from '../constants/roles.js';
import { truncateString } from '../utils/format.js';

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
                .setDescription(this.description)
                .addStringOption(option => {
                                    return option
                                        .setName('mode')
                                        .setDescription('The mode to run this command in')
                                        .setChoices([
                                            {
                                                name: 'counts',
                                                value: 'counts'
                                            },
                                            {
                                                name: 'limbo',
                                                value: 'limbo'
                                            },
                                            {
                                                name: 'unauthorized',
                                                value: 'unauthorized'
                                            }
                                        ]
                                        )
                                        .setRequired(true)
                                }),
                { idHints: ['1324644451473166357'] }
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ephemeral: true});

            const mode = interaction.options.getString("mode", true);

            const guild = interaction.guild;

            if (!guild) throw new CustomError("Please use this command within a server. (guild cannot be determined).", ErrorType.Error);

            let memberRole = guild.roles.cache.get(RoleId.Linked);

            if (!memberRole) throw new CustomError("Member role is not defined. Likely a bad hardcoded ID, so blame Vince.", ErrorType.Error);

            await guild.members.fetch();


            const memberCount = (await interaction.guild.members.fetch()).filter(member => !member.user.bot).size;
            const trackedUsersCount = await getTotalUserCount();
            const linkedUserCount = await getTotalLinkedUserCount();
            const unlinkedUserCount = await getTotalUnlinkedUserCount();
            // const membersWithMemberRole = memberRole.members.filter(member => !member.user.bot);

            let membersWithMemberRole = guild.members.cache.filter(member => member.roles.cache.has(memberRole.id) && !member.user.bot);
            let membersWithoutMemberRole = guild.members.cache.filter(member => !member.roles.cache.has(memberRole.id) && !member.user.bot);

            const membersWithMemberRoleCount = membersWithMemberRole.size;
            const membersWithoutMemberRoleCount = membersWithoutMemberRole.size;

            const linkedUsersWithoutMemberRole = (await getLinkedUsersFromMembers(membersWithoutMemberRole)).map(user => membersWithoutMemberRole.get(user.discordId));
            const unlinkedUsersWithMemberRole = (await getUnlinkedUsersFromMembers(membersWithMemberRole)).map(user => membersWithMemberRole.get(user.discordId));

            const linkedUsersWithoutMemberRoleArray = linkedUsersWithoutMemberRole.map(member => member?.user.username);
            const unlinkedUsersWithMemberRoleArray = unlinkedUsersWithMemberRole.map(member => member?.user.username);

            const linkedUsersWithoutMemberRoleString = truncateString(linkedUsersWithoutMemberRoleArray.join('\n'), 4096);
            const unlinkedUsersWithMemberRoleString = truncateString(unlinkedUsersWithMemberRoleArray.join('\n'), 4096);

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
                        value: `${membersWithMemberRoleCount}`,
                        inline: true
                    },
                    {
                        name: 'Without Member Role',
                        value: `${membersWithoutMemberRoleCount}`,
                        inline: true
                    },
                    {
                        name: 'Users in limbo',
                        value: `${linkedUsersWithoutMemberRoleArray.length}`,
                        inline: true
                    },
                    {
                        name: 'Unauthorized users',
                        value: `${unlinkedUsersWithMemberRole.length}`,
                        inline: true
                    }
                ]);

                const limboUsersEmbed = new EmbedBuilder()
                    .setTitle("Users in limbo (linked but no member role)")
                    .setDescription(`${linkedUsersWithoutMemberRoleString.length > 0 ? linkedUsersWithoutMemberRoleString : "none"}`);

                const unauthorizedUsersEmbed = new EmbedBuilder()
                    .setTitle("Unauthorized users (not linked but has member role)")
                    .setDescription(`${unlinkedUsersWithMemberRoleString.length > 0 ? unlinkedUsersWithMemberRoleString : "none"}`);

                const message = new MessageBuilder();

                if (mode == "counts") message.setEmbeds([statsEmbed]);
                else if (mode == "limbo") message.setEmbeds([limboUsersEmbed]);
                else if (mode == "unauthorized") message.setEmbeds([unauthorizedUsersEmbed]);
                else message.setEmbeds([statsEmbed]);

            return interaction.editReply(message);

        } catch (error) {
            handleCommandError(interaction, error);
        }
    }
}
