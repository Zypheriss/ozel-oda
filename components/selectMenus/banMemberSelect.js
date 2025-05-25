const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  id: 'banMemberSelect',
  
  execute: async (interaction) => {
    const channelId = interaction.customId.split('_')[1];
    const userId = interaction.values[0];
    
    const channel = interaction.guild.channels.cache.get(channelId);
    
    if (!channel) {
      return interaction.update({
        content: '❌ Kanal bulunamadı!',
        components: []
      });
    }
    
    const voiceChannelInfo = interaction.client.voiceChannels.get(channelId);
    
    if (!voiceChannelInfo || voiceChannelInfo.ownerId !== interaction.user.id) {
      return interaction.update({
        content: '❌ Bu odayı yönetme yetkiniz yok!',
        components: []
      });
    }
    
    try {
      const targetUser = await interaction.guild.members.fetch(userId);
      await channel.permissionOverwrites.edit(targetUser, {
        Connect: false
      });
      if (targetUser.voice.channelId === channelId) {
        await targetUser.voice.disconnect();
      }
      
      await interaction.update({
        content: `<:zypCeza:1372505913293934623> <@${userId}> kullanıcısı odadan yasaklandı!`,
        components: []
      });
    } catch (error) {
      console.error('Üye yasaklama hatası:', error);
      return interaction.update({
        content: '❌ Üye yasaklanırken bir hata oluştu!',
        components: []
      });
    }
  }
};