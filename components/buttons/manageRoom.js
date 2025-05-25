const { EmbedBuilder } = require('discord.js');

module.exports = {
  id: 'manageRoom',
  
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
      const owner = await interaction.guild.members.fetch(voiceChannelInfo.ownerId);
      const members = channel.members.size;
      const limit = channel.userLimit || 'Sınırsız';
      const isLocked = voiceChannelInfo.isLocked ? 'Evet' : 'Hayır';
      const isHidden = voiceChannelInfo.isHidden ? 'Evet' : 'Hayır';
      const permissionOverwrites = channel.permissionOverwrites.cache;
      const specialUsers = permissionOverwrites.filter(perm => 
        perm.id !== interaction.guild.id && 
        perm.id !== voiceChannelInfo.ownerId
      );
      
      let specialUsersText = 'Yok';
      if (specialUsers.size > 0) {
        const userList = [];
        for (const [id, permissions] of specialUsers) {
          try {
            const member = await interaction.guild.members.fetch(id);
            const canConnect = permissions.allow.has('Connect');
            const cannotConnect = permissions.deny.has('Connect');
            
            if (canConnect) {
              userList.push(`✅ ${member.user.username}`);
            } else if (cannotConnect) {
              userList.push(`<:xicon:1375806476785942648> ${member.user.username}`);
            }
          } catch (error) {
            console.error(`Üye bilgisi alınamadı: ${id}`, error);
          }
        }
        specialUsersText = userList.join('\n');
      }
      
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('⚙️ Oda Yönetim Paneli')
        .addFields(
          { name: 'Oda Sahibi', value: owner.user.username, inline: true },
          { name: 'Oda İsmi', value: channel.name, inline: true },
          { name: 'Kullanıcı Sayısı', value: members.toString(), inline: true },
          { name: 'Kullanıcı Limiti', value: limit.toString(), inline: true },
          { name: 'Kilitli mi?', value: isLocked, inline: true },
          { name: 'Gizli mi?', value: isHidden, inline: true },
          { name: 'Özel İzinli Kullanıcılar', value: specialUsersText }
        )
        .setFooter({ text: 'Oda oluşturulma tarihi' })
        .setTimestamp(channel.createdAt);
      
      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
    } catch (error) {
      console.error('Oda yönetimi hatası:', error);
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Oda bilgileri alınırken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};