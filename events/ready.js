const { ActivityType } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı!`);
    client.user.setPresence({
      activities: [{ 
        name: '/yardım | Özel Oda', 
        type: ActivityType.Listening 
      }],
      status: 'dnd'
    });
    
    console.log('Bot durumu güncellendi.');
  }
};