import { Command } from '@sapphire/framework';
import { initLink } from '../utils/interactions.js';
import { handleCommandError } from '../utils/errors.js';


export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder
        .setName('link')
        .setDescription('Link your sticknodes.com account')
        .addStringOption(option => {
          return option
            .setName('username')
            .setDescription("Your sticknodes.com username")
            .setRequired(true)
        }),
      { idHints: ['1295453491338154067'] }
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    try {
      const username = interaction.options.getString('username') ?? '';

      await initLink(interaction, username);

    } catch (error) {
      handleCommandError(interaction, error);
    }
  }
}
