import { Command } from '@sapphire/framework';
import { EmbedBuilder, ApplicationCommandType } from 'discord.js';
import type { User, ContextMenuCommandType } from 'discord.js';
import { getSnUser } from '../utils/user.js';
import { getUserEmbed, getUserNotFoundEmbed } from '../utils/embeds.js';

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
      {idHints: ['1295678105863716924']}
    );

    registry.registerContextMenuCommand((builder) =>
      builder
      .setName('profile')
      .setType(ApplicationCommandType.User as ContextMenuCommandType),
      {idHints: ['1295965953258946621']}
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const username = interaction.options.getString('username');

    const msg = await interaction.reply({ content: `Searching for user **${username}**...`, ephemeral: false, fetchReply: true });

    const user = await getSnUser(username ? username : '');

    if (user.id === 0) {
      return interaction.editReply({content: "", embeds: [getUserNotFoundEmbed(username ? username : '')]});
    }

    const embed = await getUserEmbed(user);

    return interaction.editReply({content: "", embeds: [embed]});
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    return interaction.reply('Pong');
  }
}