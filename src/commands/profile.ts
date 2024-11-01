import { Command } from '@sapphire/framework';
import { EmbedBuilder, ApplicationCommandType } from 'discord.js';
import type { User, ContextMenuCommandType, GuildMember } from 'discord.js';
import { getSnUser } from '../utils/users.js';
import { getErrorEmbed, getNoUserLinkedEmbed, getUserEmbed, getUserNotFoundEmbed } from '../utils/embeds.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { findByDiscordIdWhereSnUsernameNotNull, findBySnUsername } from '../utils/database.js';

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
        })
        .addBooleanOption(option => {
          return option
            .setName('visible-to-all')
            .setDescription('Whether to make the result visible to everyone in chat. Default is false.')
            .setRequired(false)
        })
        .addBooleanOption(option => {
          return option
            .setName('bypass-cache')
            .setDescription("Whether to bypass the cache to get the most up to date profile from sticknodes.com.")
            .setRequired(false)
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
      const visible = interaction.options.getBoolean('visible-to-all') ?? false;
      
      const bypassCache = interaction.options.getBoolean('bypass-cache') ?? false;

      const username = interaction.options.getString('username') ?? '';

      await interaction.reply({ content: `Searching for user **${username}**...`, ephemeral: !visible });

      const user = await getSnUser(username, bypassCache);

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
      await interaction.reply({ content: `Checking for linked sn account...`, ephemeral: true });
      const linkedSnUsername = (await findByDiscordIdWhereSnUsernameNotNull(interaction.targetId).catch(error => { throw error }))?.snUsername;

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