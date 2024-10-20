import { Command } from '@sapphire/framework';
import { EmbedBuilder, ApplicationCommandType } from 'discord.js';
import type { User, ContextMenuCommandType, GuildMember } from 'discord.js';
import { getSnUser } from '../utils/user.js';
import { getErrorEmbed, getNoUserLinkedEmbed, getUserEmbed, getUserNotFoundEmbed } from '../utils/embeds.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { findByDiscordId, findBySnUsername } from '../utils/database.js';

export class ProfileCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('profile')
        .setDescription('View someone\'s sticknodes.com profile')
        .addStringOption(option => {
          return option
            .setName('username')
            .setDescription("Your sticknodes.com username")
            .setRequired(true)
        }),
      { idHints: ['1295678105863716924'] }
    );

    registry.registerContextMenuCommand((builder) =>
      builder
        .setName('profile')
        .setType(ApplicationCommandType.User as ContextMenuCommandType),
      { idHints: ['1295965953258946621'] }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      const username = interaction.options.getString('username') ?? '';

      await interaction.reply({ content: `Searching for user **${username}**...`, ephemeral: false, fetchReply: true });

      const user = await getSnUser(username, true);

      if (user.id === 0) {
        return await interaction.editReply({ content: "", embeds: [getUserNotFoundEmbed(username)] });
      }

      const linkedDiscordId = (await findBySnUsername(username).catch(error => { throw error }))?.discordId ?? null;

      let linkedDiscordMember: GuildMember | null = null;

      if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => {console.log(err)})) ?? null;

      const embed = await getUserEmbed(user, linkedDiscordMember);

      return await interaction.editReply({ content: "", embeds: [embed] });
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    try {
      await interaction.reply({ content: `Checking for linked sn account...`, ephemeral: false, fetchReply: true });
      const linkedSnUsername = (await findByDiscordId(interaction.targetId).catch(error => { throw error }))?.snUsername;

      if (linkedSnUsername) {
        const user = await getSnUser(linkedSnUsername);

        if (user.id === 0) {
          return await interaction.editReply({ content: "", embeds: [getUserNotFoundEmbed(linkedSnUsername)] });
        }

        const linkedDiscordId = interaction.targetId;

        let linkedDiscordMember: GuildMember | null = null;

        if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => {console.log(err)})) ?? null;

        const embed = await getUserEmbed(user, linkedDiscordMember);

        return await interaction.editReply({ content: "", embeds: [embed] });
      } else {
        return await interaction.editReply({ content: "", embeds: [getNoUserLinkedEmbed(interaction.targetId)] });
      }
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }
}