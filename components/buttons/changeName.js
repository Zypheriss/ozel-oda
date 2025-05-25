const { createRenameModal } = require('../../utils/channelManager');

module.exports = {
  id: 'changeName',
  
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
      // İsim değiştirme modalını oluştur ve göster
      const modal = createRenameModal(interaction);
      await interaction.showModal(modal);
    } catch (error) {
      console.error('İsim değiştirme hatası:', error);
      return interaction.reply({
        content: '<:xicon:1375806476785942648> İsim değiştirme işlemi sırasında bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};