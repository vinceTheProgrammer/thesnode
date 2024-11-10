import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { findTodaysBirthdays } from '../utils/database.js';
import { sendEmbed } from '../utils/messages.js';
import { getBirthdayEmbed } from '../utils/embeds.js';
import { ChannelId } from '../constants/channels.js';
import { getReactionEmoji } from '../constants/birthdayMessages.js';
import { createNoticesThread } from '../utils/threads.js';

export class AnnounceBirthdaysTask extends ScheduledTask {
	public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
		super(context, {
			...options,
			pattern: '0 11 * * *'
		});
	}

	public async run() {
        try {
			const birthdayUsers = await findTodaysBirthdays();
			if (birthdayUsers.length == 0) return;
			const birthdayEmbed = getBirthdayEmbed(birthdayUsers);
			const msg = await sendEmbed(ChannelId.BirthdayAnnounce, birthdayEmbed);
			if (msg) createNoticesThread(msg);
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