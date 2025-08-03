import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { findTodaysBirthdays } from '../utils/database.js';
import { sendEmbed } from '../utils/messages.js';
import { getBirthdayEmbed } from '../utils/embeds.js';
import { ChannelId } from '../constants/channels.js';
import { getReactionEmoji } from '../constants/birthdayMessages.js';
import { createNoticesThread } from '../utils/threads.js';
import { GUILD_ID } from '../constants/guild.js';

export class AnnounceBirthdaysTask extends ScheduledTask {
	public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
		super(context, {
			...options,
			pattern: '0 17 * * *'
		});
	}

	public async run() {
        try {
			let birthdayUsers = await findTodaysBirthdays();
			const guild = await this.container.client.guilds.fetch(GUILD_ID);
			const presentBirthdayUsers: typeof birthdayUsers = [];

			for (const u of presentBirthdayUsers) {
			try {
				await guild.members.fetch(u.discordId);
				presentBirthdayUsers.push(u);
			} catch {
				// not in guild; skip
			}
			}
			if (presentBirthdayUsers.length == 0) return;
			const birthdayEmbed = getBirthdayEmbed(presentBirthdayUsers);
			const msg = await sendEmbed(ChannelId.BirthdayAnnounce, birthdayEmbed);
      let birthdayDisplayname = ''; 
      if (presentBirthdayUsers.length === 1 && presentBirthdayUsers[0]) birthdayDisplayname = (await this.container.client.users.fetch(presentBirthdayUsers[0].discordId)).displayName;
			if (msg) createNoticesThread(msg, `Happy birthday, ${presentBirthdayUsers.length > 1 ? `${presentBirthdayUsers.length} users` : `${birthdayDisplayname}`}`);
			const emoji = getReactionEmoji(birthdayEmbed.data.description ?? '');
			msg?.react(emoji)
		} catch (error) {
			console.log(error);
		}
	}
}

declare module '@sapphire/plugin-scheduled-tasks' {
	interface ScheduledTasks {
		pattern: never;
	}
}
