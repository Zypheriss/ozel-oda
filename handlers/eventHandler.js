const fs = require('fs');
const path = require('path');

module.exports = {
  loadEvents: async (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      
      console.log(`Event yüklendi: ${event.name}`);
    }

    console.log('Tüm eventler başarıyla yüklendi.');
  }
};