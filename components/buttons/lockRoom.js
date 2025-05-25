const { PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  id: 'lockRoom',
  
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
      const isLocked = voiceChannelInfo.isLocked;
      
      if (!isLocked) {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          Connect: false
        });
        
        voiceChannelInfo.isLocked = true;
        interaction.client.voiceChannels.set(channelId, voiceChannelInfo);
        const message = await interaction.message.fetch();
        const components = message.components;
        const updatedRows = components.map((row, rowIndex) => {
          if (rowIndex === 0) {
            const buttons = row.components;
            const updatedButtons = buttons.map((button, buttonIndex) => {
              if (buttonIndex === 0) {
                return ButtonBuilder.from(button)
                  .setLabel('Odayı Aç')
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
          content: '🔒 Oda başarıyla kilitlendi! Artık sadece davet ettiğiniz üyeler katılabilir.',
          ephemeral: true
        });
      } else {
        await channel.permissionOverwrites.edit(interaction.guild.id, {
          Connect: null
        });
        
        voiceChannelInfo.isLocked = false;
        interaction.client.voiceChannels.set(channelId, voiceChannelInfo);
        const message = await interaction.message.fetch();
        const components = message.components;
        const updatedRows = components.map((row, rowIndex) => {
          if (rowIndex === 0) {
            const buttons = row.components;
            const updatedButtons = buttons.map((button, buttonIndex) => {
              if (buttonIndex === 0) {
                return ButtonBuilder.from(button)
                  .setLabel('Odayı Kilitle')
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
          content: '🔓 Oda kilidi kaldırıldı! Artık herkes katılabilir.',
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Oda kilitleme hatası:', error);
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Oda kilitleme/kilit açma işlemi sırasında bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};