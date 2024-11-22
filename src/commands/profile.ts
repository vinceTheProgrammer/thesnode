import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord.js';
import type { ContextMenuCommandType } from 'discord.js';
import { handleSnUserByDiscordIdInteraction, handleSnUserUsernameInteraction } from '../utils/interactions.js';

export class ProfileCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('profile')
        .setDescription('View someone\'s sticknodes.com profile')
        .addUserOption(option => {
          return option
            .setName('discord-user')
            .setDescription("Some Discord user")
            .setRequired(false)
        })
        .addStringOption(option => {
          return option
            .setName('sn-username')
            .setDescription("Someone's sticknodes.com username")
            .setRequired(false)
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
    const visible = interaction.options.getBoolean('visible-to-all') ?? false;
    const bypassCache = interaction.options.getBoolean('bypass-cache') ?? false;
    const discordUserParameter = interaction.options.getUser('discord-user');
    let username = interaction.options.getString('sn-username') ?? '';

    if (discordUserParameter) {
      handleSnUserByDiscordIdInteraction(interaction, discordUserParameter.id, visible, bypassCache);
    } else if (!discordUserParameter && username) {
      handleSnUserUsernameInteraction(interaction, username, visible, bypassCache);
    } else {
      handleSnUserByDiscordIdInteraction(interaction, interaction.user.id, visible, bypassCache);
    }
  }

  public override async contextMenuRun(interaction: Command.ContextMenuCommandInteraction) {
    handleSnUserByDiscordIdInteraction(interaction, interaction.targetId, false, false);
  }
}