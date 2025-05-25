const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'addMemberSelect',
  
  execute: async (interaction) => {
    const channelId = interaction.customId.split('_')[1];
    const userId = interaction.values[0];
    
    const channel = interaction.guild.channels.cache.get(channelId);
    
    if (!channel) {
      return interaction.update({
        content: '<:xicon:1375806476785942648> Kanal bulunamadı!',
        components: []
      });
    }
    
    const voiceChannelInfo = interaction.client.voiceChannels.get(channelId);
    
    if (!voiceChannelInfo || voiceChannelInfo.ownerId !== interaction.user.id) {
      return interaction.update({
        content: '<:xicon:1375806476785942648> Bu odayı yönetme yetkiniz yok!',
        components: []
      });
    }
    
    try {
      const targetUser = await interaction.guild.members.fetch(userId);
      await channel.permissionOverwrites.edit(targetUser, {
        ViewChannel: true,
        Connect: true,
        Speak: true
      });
      
      await interaction.update({
        content: `<:tikicon:1373337779248955563> <@${userId}> kullanıcısı odaya başarıyla eklendi!`,
        components: []
      });
    } catch (error) {
      console.error('Üye ekleme hatası:', error);
      return interaction.update({
        content: '<:__:1373698038853275709> Üye eklenirken bir hata oluştu!',
        components: []
      });
    }
  }
};