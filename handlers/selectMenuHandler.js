const fs = require('fs');
const path = require('path');

module.exports = {
  loadSelectMenus: async (client) => {
    const selectMenusPath = path.join(__dirname, '..', 'components', 'selectMenus');
    const selectMenuFiles = fs.readdirSync(selectMenusPath).filter(file => file.endsWith('.js'));
    
    for (const file of selectMenuFiles) {
      const filePath = path.join(selectMenusPath, file);
      const selectMenu = require(filePath);
      
      if ('id' in selectMenu && 'execute' in selectMenu) {
        client.selectMenus.set(selectMenu.id, selectMenu);
        console.log(`Select menu yüklendi: ${selectMenu.id}`);
      } else {
        console.log(`[UYARI] ${filePath} dosyasında "id" veya "execute" özelliği eksik.`);
      }
    }

    console.log(`Toplam ${client.selectMenus.size} select menu yüklendi.`);
  }
};