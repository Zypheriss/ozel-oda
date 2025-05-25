const fs = require('fs');
const path = require('path');

module.exports = {
  loadButtons: async (client) => {
    const buttonsPath = path.join(__dirname, '..', 'components', 'buttons');
    const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));
    
    for (const file of buttonFiles) {
      const filePath = path.join(buttonsPath, file);
      const button = require(filePath);
      
      if ('id' in button && 'execute' in button) {
        client.buttons.set(button.id, button);
        console.log(`Buton yüklendi: ${button.id}`);
      } else {
        console.log(`[UYARI] ${filePath} dosyasında "id" veya "execute" özelliği eksik.`);
      }
    }

    console.log(`Toplam ${client.buttons.size} buton yüklendi.`);
  }
};