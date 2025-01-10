import { SapphireClient } from '@sapphire/framework';
import '@sapphire/plugin-scheduled-tasks/register';
import { GatewayIntentBits } from 'discord.js';

const client = new SapphireClient({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
  tasks: {
    bull: {
      connection: {}
    }
  }
});

client.login(process.env.BOT_TOKEN);