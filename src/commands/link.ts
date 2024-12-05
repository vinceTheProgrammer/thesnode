import { Command } from '@sapphire/framework';
import { getSnUser } from '../utils/users.js';
import { getKeyReply, getLinkMessageAndEmbed, getLinkSuccessEmbed, getLinkUserConfirmationMessage, getUsernameHintMessageAndEmbed, getUserNotFoundEmbed } from '../utils/embeds.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { ErrorType } from '../constants/errors.js';
import { generateKey } from '../utils/strings.js';
import { findBySnUsername, linkUser, unlinkUser } from '../utils/database.js';
import { clearBadgeRoles, giveLinkedRole, removeLinkedRole, syncBadgeRoles } from '../utils/roles.js';
import { checkBirthdayIsWithinTos, checkIfUserIsBanned } from '../utils/moderation.js';


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

      await interaction.reply({ content: `Searching for user **${username}**...`, ephemeral: true });

      const user = await getSnUser(username);

      if (user.id === 0) {
        const userNotFoundEmbed = getUserNotFoundEmbed(username);
        let msgAndEmbed = getUsernameHintMessageAndEmbed();
        const helpEmbed = msgAndEmbed.embedBuilder;
        msgAndEmbed.messageBuilder.setEmbeds([userNotFoundEmbed, helpEmbed]);
        return await interaction.editReply(msgAndEmbed.messageBuilder);
      }

      checkIfUserIsBanned(user, interaction.user);

      const stillLinkedId = (await findBySnUsername(username).catch(error => { throw error }))?.discordId;

      const responseLinkUserConfirm = await interaction.editReply(getLinkUserConfirmationMessage(user, stillLinkedId));

      const collectorFilter = (i: { user: { id: string; }; }) => i.user.id === interaction.user.id;
      try {
        const confirmation = await responseLinkUserConfirm.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

        const key = generateKey();
        const responseLinkVerify = await confirmation.update(getLinkMessageAndEmbed(key, interaction.user.id, username).messageBuilder);
        await interaction.followUp(getKeyReply(key));

        try {
          const verification = await responseLinkVerify.awaitMessageComponent({ filter: collectorFilter, time: 840_000 });
          const nonStaleUser = await getSnUser(username, true);
          const bio = nonStaleUser.bio;

          const keyPresent = bio.includes(key);

          if (keyPresent) {

            if (stillLinkedId && stillLinkedId !== interaction.user.id) {
              await unlinkUser(stillLinkedId).catch(error => { throw error });
              if (interaction.guild) {
                const member = await interaction.guild.members.fetch(stillLinkedId).catch(err => {console.log(err)});
                if (member) {
                  removeLinkedRole(member).catch(err => {console.log(err)});
                  clearBadgeRoles(member).catch(err => {console.log(err)});
                }
              }
            }

            await linkUser(interaction.user.id, username, nonStaleUser.socials.birthday).catch(error => { throw error });
            if (interaction.guild) {
              const member = await interaction.guild.members.fetch(interaction.user.id).catch(err => {console.log(err)});
              if (member) {
                giveLinkedRole(member).catch(err => {console.log(err)});
                syncBadgeRoles(member, user).catch(err => {console.log(err)});
              }
            }

            checkBirthdayIsWithinTos(nonStaleUser, interaction.user);

            return await verification.update({ content: '', embeds: [getLinkSuccessEmbed(interaction.user.id, username)], components: [], files: []});
          } else {
            throw new CustomError("Key not found in bio. Verification failed. Linking canceled. Please try again.", ErrorType.Warning);
          }

        } catch (error) {
          if (error instanceof CustomError) throw error;
          throw new CustomError("Verification not completed within 14 minutes. Linking canceled.", ErrorType.Warning, error as Error);
        }

      } catch (error) {
        if (error instanceof CustomError) throw error;
        throw new CustomError("Confirmation not received within 1 minute. Linking canceled.", ErrorType.Warning, error as Error);
      }
    } catch (error) {
      handleCommandError(interaction, error);
    }
  }
}
