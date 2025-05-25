const fs = require('fs');
const path = require('path');

module.exports = {
  loadCommands: async (client) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`Komut yüklendi: ${command.data.name}`);
      } else {
        console.log(`[UYARI] ${filePath} dosyasında "data" veya "execute" özelliği eksik.`);
      }
    }

    console.log(`Toplam ${client.commands.size} komut yüklendi.`);
  }
};