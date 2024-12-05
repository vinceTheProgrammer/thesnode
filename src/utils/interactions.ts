import type { ButtonInteraction, GuildMember, ModalSubmitInteraction } from "discord.js";
import { findByDiscordIdWhereSnUsernameNotNull, findBySnUsername, linkUser, unlinkUser } from "./database.js";
import { getKeyReply, getLinkMessageAndEmbed, getLinkSuccessEmbed, getLinkUserConfirmationMessage, getNoUserLinkedEmbed, getUserEmbed, getUsernameHintMessageAndEmbed, getUserNotFoundEmbed } from "./embeds.js";
import { CustomError, handleCommandError } from "./errors.js";
import { Command } from "@sapphire/framework";
import { getSnUser } from "./users.js";
import { ErrorType } from "../constants/errors.js";
import { checkIfUserIsBanned, checkBirthdayIsWithinTos } from "./moderation.js";
import { removeLinkedRole, clearBadgeRoles, giveLinkedRole, syncBadgeRoles } from "./roles.js";
import { generateKey } from "./strings.js";

export async function handleSnUserByDiscordIdInteraction(interaction: Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction, userId: string, visible: boolean, bypassCache: boolean) {
  try {
    await interaction.reply({ content: `Checking for linked sn account...`, ephemeral: !visible });
    const linkedSnUsername = (await findByDiscordIdWhereSnUsernameNotNull(userId).catch(error => { throw error }))?.snUsername;

    if (linkedSnUsername) {
      const user = await getSnUser(linkedSnUsername, bypassCache);

      if (user.id === 0) {
        return await interaction.editReply({ content: "", embeds: [getUserNotFoundEmbed(linkedSnUsername)] });
      }

      const linkedDiscordId = userId;

      let linkedDiscordMember: GuildMember | null = null;

      if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => { console.log(err) })) ?? null;

      const embed = await getUserEmbed(user, linkedDiscordMember);

      return await interaction.editReply({ content: "", embeds: [embed] });
    } else {
      return await interaction.editReply({ content: "", embeds: [getNoUserLinkedEmbed(userId)] });
    }
  } catch (error) {
    handleCommandError(interaction, error);
  }
}

export async function handleSnUserUsernameInteraction(interaction: Command.ChatInputCommandInteraction, username: string, visible: boolean, bypassCache: boolean) {
  try {
    await interaction.reply({ content: `Searching for user **${username}**...`, ephemeral: !visible });

    const user = await getSnUser(username, bypassCache);

    if (user.id === 0) {
      return await interaction.editReply({ content: "", embeds: [getUserNotFoundEmbed(username)] });
    }

    const linkedDiscordId = (await findBySnUsername(username).catch(error => { throw error }))?.discordId ?? null;

    let linkedDiscordMember: GuildMember | null = null;

    if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => { console.log(err) })) ?? null;

    const embed = await getUserEmbed(user, linkedDiscordMember);

    return await interaction.editReply({ content: "", embeds: [embed] });
  } catch (error) {
    handleCommandError(interaction, error);
  }
}

export async function initLink(interaction: Command.ChatInputCommandInteraction | ModalSubmitInteraction, username: string) {
  try {
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
    throw error;
  }
}