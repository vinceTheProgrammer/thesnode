import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ModalSubmitInteraction } from 'discord.js';
import { initLink } from '../utils/interactions.js';
import { handleCommandError } from '../utils/errors.js';

export class ModalSubmitHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
    });
  }

  public async run(interaction: ModalSubmitInteraction): Promise<void> {
    try {
      // Get the username input from the modal
      const username = interaction.fields.getTextInputValue('sn-username');

      // Call initLink with the interaction and username
      await initLink(interaction, username);
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }

  public override async parse(interaction: ModalSubmitInteraction) {
    if (interaction.customId === 'link-modal') {
      return this.some(); // Indicates this handler is responsible for this interaction
    }
    return this.none(); // Skip if not the correct customId
  }
}