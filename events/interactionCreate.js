module.exports = {
  name: 'interactionCreate',
  execute: async (interaction, client) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        
        if (!command) {
          console.error(`${interaction.commandName} komutu bulunamadı.`);
          return;
        }
        
        await command.execute(interaction);
      }
      else if (interaction.isButton()) {
        const buttonId = interaction.customId;
        const button = client.buttons.get(buttonId.split('_')[0]);
        
        if (!button) {
          console.error(`${buttonId} butonu bulunamadı.`);
          return;
        }
        
        await button.execute(interaction);
      }
      else if (interaction.isStringSelectMenu()) {
        const selectMenuId = interaction.customId;
        const selectMenu = client.selectMenus.get(selectMenuId.split('_')[0]);
        
        if (!selectMenu) {
          console.error(`${selectMenuId} select menüsü bulunamadı.`);
          return;
        }
        
        await selectMenu.execute(interaction);
      }
      else if (interaction.isModalSubmit()) {
        const modalId = interaction.customId;
        
        if (modalId.startsWith('roomName')) {
          const newName = interaction.fields.getTextInputValue('roomNameInput');
          const channel = interaction.channel;
          
          try {
            await channel.setName(newName);
            await interaction.reply({ 
              content: `<:tikicon:1373337779248955563> Oda ismi başarıyla **${newName}** olarak değiştirildi.`,
              ephemeral: true 
            });
          } catch (error) {
            console.error('İsim değiştirme hatası:', error);
            await interaction.reply({ 
              content: ' <:xicon:1375806476785942648> Oda ismi değiştirilirken bir hata oluştu!',
              ephemeral: true 
            });
          }
        }
        
        else if (modalId.startsWith('roomLimit')) {
          const newLimit = interaction.fields.getTextInputValue('roomLimitInput');
          const channel = interaction.channel;
          if (isNaN(newLimit) || newLimit < 0 || newLimit > 99) {
            return interaction.reply({ 
              content: '<:xicon:1375806476785942648> Geçersiz bir limit girdiniz! Lütfen 0-99 arasında bir sayı girin.',
              ephemeral: true 
            });
          }
          
          try {
            await channel.setUserLimit(Number(newLimit));
            await interaction.reply({ 
              content: `<:tikicon:1373337779248955563> Oda limiti başarıyla **${newLimit}** olarak ayarlandı.`,
              ephemeral: true 
            });
          } catch (error) {
            console.error('Limit değiştirme hatası:', error);
            await interaction.reply({ 
              content: '<:xicon:1375806476785942648> Oda limiti değiştirilirken bir hata oluştu!',
              ephemeral: true 
            });
          }
        }
      }
    } catch (error) {
      console.error('Interaction işleme hatası:', error);
    }
  }
};