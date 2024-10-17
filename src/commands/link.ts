import { Command } from '@sapphire/framework';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

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
      {idHints: ['1295453491338154067']}
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    const username = interaction.options.getString('username');

    const msg = await interaction.reply({ content: `Searching for user...`, ephemeral: false, fetchReply: true });

    const successEmbed = new EmbedBuilder()
    .setTitle("User found")
    .addFields(
      {
        name: "Vince the Animator",
        value: "[@vincetheanimator](https://sticknodes.com/members/vincetheanimator/)",
        inline: false
      },
    )
    .setImage("https://sticknodes.com/wp-content/uploads/avatars/4964/5dd10863c6933-bpfull.png")
    .setColor("#33d17a");

    const failureEmbed = new EmbedBuilder()
    .setTitle(`User "${username}" not found.`)
    .setColor("#e01b24");

    const confirmationButton = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Link this account')
    .setStyle(ButtonStyle.Success);

    const confirmationRow = new ActionRowBuilder<ButtonBuilder>()
	  .addComponents(confirmationButton);


    //return interaction.editReply({content: "", embeds: [successEmbed], components: [confirmationRow]});
    return interaction.editReply({content: "", embeds: [failureEmbed]});
  }
}