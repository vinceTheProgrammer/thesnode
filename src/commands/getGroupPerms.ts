import { Command } from '@sapphire/framework';
import { ChannelId } from '../constants/channels.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { giveGroupPerms } from '../utils/roles.js';
import { getBasicEmbed } from '../utils/embeds.js';
import { Color } from '../constants/colors.js';
import { DiscordMemberBeforeDateRequirement, HasAnySnBadgeRequirement, HasGroupMemberCountGENumber, OrRequirement, SticknodesMemberBeforeDateRequirement } from '../utils/requirements.js';
import { getDateBefore } from '../utils/time.js';
import { TimeUnit } from '../constants/time.js';
import { ErrorMessage, ErrorType } from '../constants/errors.js';
import { RoleId } from '../constants/roles.js';
import { GuildChannel } from 'discord.js';

export class GetGroupPermsCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    let groupChannelName = '💬┃groups';
    const groupChannel = this.container.client.channels.cache.get(ChannelId.Groups);
    if (groupChannel instanceof GuildChannel) {
      groupChannelName = groupChannel.name;
    }

    registry.registerChatInputCommand((builder) =>
      builder.setName('get-group-perms').setDescription(`Check if you meet the requirements to get permission to create posts in "${groupChannelName}"`),
      //{idHints: ['']}
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      await interaction.reply({ content: `Checking requirements...`, ephemeral: true });

      if (!interaction.guild) throw new CustomError(ErrorMessage.GuildNotDefined, ErrorType.Error);
      const member = await interaction.guild.members.fetch(interaction.user.id).catch(err => { throw new CustomError(ErrorMessage.MemberNotDefined, ErrorType.Error, err) });

      const alreadyHasGroupPerms = member.roles.cache.has(RoleId.GroupPerms);
      if (alreadyHasGroupPerms) return interaction.editReply({ content: '', embeds: [getBasicEmbed({ description: `You already have group perms!`, color: Color.SuccessGreen })] });

      const discordMemberBeforeDate = new SticknodesMemberBeforeDateRequirement(getDateBefore(6, TimeUnit.Months));
      const hasAnyGoodRole = new HasAnySnBadgeRequirement();
      const hasGroupMemberCountGENumber = new HasGroupMemberCountGENumber(10);

      const complexRequirement = new OrRequirement(
        hasAnyGoodRole,
        discordMemberBeforeDate,
        hasGroupMemberCountGENumber
      );

      const result = await complexRequirement.evaluate(member);

      if (result.success) {
        await giveGroupPerms(member);
        return await interaction.editReply({ content: '', embeds: [getBasicEmbed({ description: `You appear to meet the necessary requirements and thus have been granted permission to create posts in <#${ChannelId.Groups}> ✅\n${result.message}`, color: Color.SuccessGreen })] });
      }

      return interaction.editReply({ content: '', embeds: [getBasicEmbed({ description: `You do not appear to meet all requirements:\n${result.message}`, color: Color.ErrorRed })] });
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }
}