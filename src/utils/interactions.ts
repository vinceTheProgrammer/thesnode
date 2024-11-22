import type { GuildMember } from "discord.js";
import { findByDiscordIdWhereSnUsernameNotNull, findBySnUsername } from "./database.js";
import { getNoUserLinkedEmbed, getUserEmbed, getUserNotFoundEmbed } from "./embeds.js";
import { handleCommandError } from "./errors.js";
import { Command } from "@sapphire/framework";
import { getSnUser } from "./users.js";

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
  
          if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => {console.log(err)})) ?? null;
  
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
  
        if (linkedDiscordId && interaction.guild) linkedDiscordMember = (await interaction.guild.members.fetch(linkedDiscordId).catch(err => {console.log(err)})) ?? null;
  
        const embed = await getUserEmbed(user, linkedDiscordMember);
  
        return await interaction.editReply({ content: "", embeds: [embed] });
      } catch (error) {
        handleCommandError(interaction, error);
      }
}