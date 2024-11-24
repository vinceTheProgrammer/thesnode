import { AllFlowsPrecondition } from '@sapphire/framework';
import type { CommandInteraction, ContextMenuCommandInteraction, Message, Snowflake } from 'discord.js';
import { RoleId } from '../constants/roles.js';

export class UserPrecondition extends AllFlowsPrecondition {
	#message = 'You must be a staff member to use this command.';

	public override chatInputRun(interaction: CommandInteraction) {
		return this.doStaffCheck(interaction.user.id, interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache);
	}

	public override contextMenuRun(interaction: ContextMenuCommandInteraction) {
		return this.doStaffCheck(interaction.user.id, interaction.guild?.members.cache.get(interaction.user.id)?.roles.cache);
	}

	public override messageRun(message: Message) {
		return this.doStaffCheck(message.author.id, message.member?.roles.cache);
	}

	private doStaffCheck(userId: Snowflake, rolesCache?: Map<string, any>) {
		if (!rolesCache) {
			return this.error({ message: 'Unable to determine roles. Please try again later.' });
		}

		return rolesCache.has(RoleId.Staff) ? this.ok() : this.error({ message: this.#message });
	}
}

declare module '@sapphire/framework' {
	interface Preconditions {
		StaffOnly: never;
	}
}
