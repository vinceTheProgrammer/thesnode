import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ModalSubmitInteraction } from 'discord.js';
import type { ButtonInteraction } from 'discord.js';
import { initLink } from '../utils/interactions.js';
import { handleCommandError } from '../utils/errors.js';

export class ButtonHandler extends InteractionHandler {
  public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
    super(ctx, {
      ...options,
      interactionHandlerType: InteractionHandlerTypes.Button,
    });
  }

  public async run(interaction: ButtonInteraction): Promise<void> {
    try {
      // Create the modal
      const modal = new ModalBuilder()
        .setCustomId('link-modal')
        .setTitle('Link Your Sticknodes Account');

      // Add a text input field
      const usernameInput = new TextInputBuilder()
        .setCustomId('sn-username')
        .setLabel('Enter your Sticknodes.com username:')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      // Build action row for the input
      const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(usernameInput);

      // Add the action row to the modal
      modal.addComponents(actionRow);

      // Show the modal to the user
      await interaction.showModal(modal);
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }

  public override async parse(interaction: ButtonInteraction) {
    if (interaction.customId === 'link-verify-init') {
      return this.some(); // Indicates this handler is responsible for this interaction
    }
    return this.none(); // Skip if not the correct customId
  }
}