import { Command } from '@sapphire/framework';
import { sendEmbed } from '../utils/messages.js';
import { findTodaysBirthdays } from '../utils/database.js';
import { getBirthdayEmbed } from '../utils/embeds.js';
import { Channels } from '../constants/channels.js';
import { emojiVariants, getReactionEmoji } from '../constants/birthdayMessages.js';

export class DebugBirthdayCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) =>
      builder.setName('debugbirthday').setDescription('Check for birthdays and send announcement if birthdays are found.'),
      //{idHints: ['']}
    );
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.reply({ content: `trying...`, ephemeral: true, fetchReply: true });

    try {
        const birthdayUsers = await findTodaysBirthdays();
        if (birthdayUsers.length == 0) return;
        const birthdayEmbed = getBirthdayEmbed(birthdayUsers);
        const msg = await sendEmbed(Channels.BirthdayAnnounce, birthdayEmbed);
        const emoji = getReactionEmoji(birthdayEmbed.data.description ?? '');
        msg?.react(emoji)
    } catch (error) {
        console.log(error);
    }

    return;
  }
}