const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { token } = require('./config.json');
const { connectDatabase } = require('./database/dbConnect');
const { loadEvents } = require('./handlers/eventHandler');
const { loadCommands } = require('./handlers/commandHandler');
const { loadButtons } = require('./handlers/buttonHandler');
const { loadSelectMenus } = require('./handlers/selectMenuHandler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User]
});


client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.voiceChannels = new Collection();

(async () => {
  try {
    await connectDatabase();
    console.log('MongoDB\'ye bağlanıldı');
    await loadEvents(client);
    await loadCommands(client);
    await loadButtons(client);
    await loadSelectMenus(client);
    await client.login(token);
  } catch (error) {
    console.error('Başlatma sırasında hata:', error);
  }
})();

module.exports = client;