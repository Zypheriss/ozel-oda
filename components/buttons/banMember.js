const { StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');

module.exports = {
  id: 'banMember',
  
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
        content: '<:xicon:1375806476785942648>  Bu odayı yönetme yetkiniz yok!',
        ephemeral: true
      });
    }
    
    try {
      const connectedMembers = channel.members.filter(member => 
        !member.user.bot && 
        member.id !== interaction.user.id
      );
      const members = await interaction.guild.members.fetch({ limit: 100 });
      const filteredMembers = members.filter(member => 
        !member.user.bot && 
        member.id !== interaction.user.id
      );
      const options = filteredMembers
        .first(25)
        .map(member => ({
          label: member.user.username.substring(0, 25),
          description: connectedMembers.has(member.id) ? 'Kanalda Aktif' : 'Kanalda Değil',
          value: member.id
        }));
      
      if (options.length === 0) {
        return interaction.reply({
          content: '<:xicon:1375806476785942648> Yasaklanacak üye bulunamadı!',
          ephemeral: true
        });
      }
      const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`banMemberSelect_${channelId}`)
        .setPlaceholder('Yasaklamak istediğiniz üyeyi seçin')
        .addOptions(options);
      
      const row = new ActionRowBuilder().addComponents(selectMenu);
      
      await interaction.reply({
        content: '🚫 Lütfen odadan yasaklamak istediğiniz üyeyi seçin:',
        components: [row],
        ephemeral: true
      });
    } catch (error) {
      console.error('Üye yasaklama hatası:', error);
      return interaction.reply({
        content: '<:xicon:1375806476785942648> Üye listesi oluşturulurken bir hata oluştu!',
        ephemeral: true
      });
    }
  }
};