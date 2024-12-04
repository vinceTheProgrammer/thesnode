import { InteractionHandler, InteractionHandlerTypes } from '@sapphire/framework';
import type { ButtonInteraction } from 'discord.js';
import { getBasicEmbed } from '../utils/embeds.js';
import { Color } from '../constants/colors.js';

export class ButtonHandler extends InteractionHandler {
    public constructor(ctx: InteractionHandler.LoaderContext, options: InteractionHandler.Options) {
        super(ctx, {
          ...options,
          interactionHandlerType: InteractionHandlerTypes.Button
        });
      }
    
      public async run(interaction: ButtonInteraction, parsedData: InteractionHandler.ParseResult<this>): Promise<void> {
        await interaction.editReply({embeds: [parsedData.embed]});
      }
    
      public override async parse(interaction: ButtonInteraction) {
        if (interaction.customId === 'link-dm-init') {
            interaction.deferReply({ephemeral: true});

            const successEmbed = {
                title: "DMed you instructions for linking!",
                color: Color.SuccessGreen
            }

            const failedEmbed = {
                title: "There was a problem DMing you your linking instructions.", 
                description: "If you have your DMs closed, you may have to temporarily open them.",
                color: Color.ErrorRed
            }

            try {
                await interaction.user.send("this is a test.");
                return this.some({embed: getBasicEmbed(successEmbed)});
            } catch {
                return this.some({embed: getBasicEmbed(failedEmbed)});
            }
        }
        return this.none();
      }
}