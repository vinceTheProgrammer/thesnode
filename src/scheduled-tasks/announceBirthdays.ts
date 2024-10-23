import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { findTodaysBirthdays } from '../utils/database.js';
import { sendEmbed } from '../utils/messages.js';
import { getBirthdayEmbed } from '../utils/embeds.js';
import { Channels } from '../constants/channels.js';

export class AnnounceBirthdaysTask extends ScheduledTask {
	public constructor(context: ScheduledTask.LoaderContext, options: ScheduledTask.Options) {
		super(context, {
			...options,
			pattern: '00 10 * * *'
		});
	}

	public async run() {
        try {
            const birthdayUsers = await findTodaysBirthdays();
            if (birthdayUsers.length == 0) return;
            const birthdayEmbed = getBirthdayEmbed(birthdayUsers);
            sendEmbed(Channels.BirthdayAnnounce, birthdayEmbed);
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