const { PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  id: 'hideRoom',
  
  execute: async (interaction) => {
    const channelId = interaction.customId.split('_')[1];
    const channel = interaction.guild.channels.cache.get(channelId);
    
    if (!channel) {
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Kanal bulunamadı!',
        ephemeral: true
      });
    }
    
    const voiceChannelInfo = interaction.client.voiceChannels.get(channelId);
    
    if (!voiceChannelInfo || voiceChannelInfo.ownerId !== interaction.user.id) {
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Bu odayı yönetme yetkiniz yok!',
        ephemeral: true
      });
    }
    
    try {
      const isHidden = voiceChannelInfo.isHidden;
      
      if (!isHidden) {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          ViewChannel: false
        });
        
        voiceChannelInfo.isHidden = true;
        interaction.client.voiceChannels.set(channelId, voiceChannelInfo);
        const message = await interaction.message.fetch();
        const components = message.components;
        const updatedRows = components.map((row, rowIndex) => {
          if (rowIndex === 0) {
            const buttons = row.components;
            const updatedButtons = buttons.map((button, buttonIndex) => {
              if (buttonIndex === 1) {
                return ButtonBuilder.from(button)
                  .setLabel('Odayı Göster')
                  .setStyle(ButtonStyle.Success);
              }
              return ButtonBuilder.from(button);
            });
            
            return new ActionRowBuilder().addComponents(updatedButtons);
          }
          return ActionRowBuilder.from(row);
        });
        
        await interaction.message.edit({ components: updatedRows });
        
        return interaction.reply({
          content: '<:__:1373698038853275709> Oda başarıyla gizlendi! Artık sadece davet ettiğiniz üyeler görebilir.',
          ephemeral: true
        });
      } else {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          ViewChannel: true
        });
        
        voiceChannelInfo.isHidden = false;
        interaction.client.voiceChannels.set(channelId, voiceChannelInfo);
        const message = await interaction.message.fetch();
        const components = message.components;
        const updatedRows = components.map((row, rowIndex) => {
          if (rowIndex === 0) {
            const buttons = row.components;
            const updatedButtons = buttons.map((button, buttonIndex) => {
              if (buttonIndex === 1) {
                return ButtonBuilder.from(button)
                  .setLabel('Odayı Gizle')
                  .setStyle(ButtonStyle.Secondary);
              }
              return ButtonBuilder.from(button);
            });
            
            return new ActionRowBuilder().addComponents(updatedButtons);
          }
          return ActionRowBuilder.from(row);
        });
        
        await interaction.message.edit({ components: updatedRows });
        
        return interaction.reply({
          content: '<:__:1373698038853275709> Oda görünür yapıldı! Artık herkes görebilir.',
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Oda gizleme hatası:', error);
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Oda gizleme/gösterme işlemi sırasında bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};