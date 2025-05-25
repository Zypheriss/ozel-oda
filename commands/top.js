const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const UserStats = require('../database/models/userStats');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('top')
    .setDescription('En çok ses kanalında vakit geçiren 10 kullanıcıyı listeler.'),
  
  execute: async (interaction) => {
    await interaction.deferReply();
    
    try {
      const { guildId } = interaction;
      const topUsers = await UserStats.find({ guildId })
        .sort({ totalVoiceTime: -1 })
        .limit(10);
      
      if (topUsers.length === 0) {
        return interaction.editReply({
          content: '❌ Henüz hiçbir kullanıcı ses kanalında vakit geçirmemiş!'
        });
      }
      
      const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle('🏆 Ses Kanalı Liderlik Tablosu')
        .setDescription('En çok ses kanalında vakit geçiren kullanıcılar:')
        .setTimestamp()
        .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() });
      topUsers.forEach((user, index) => {
        const hours = Math.floor(user.totalVoiceTime / 3600000);
        const minutes = Math.floor((user.totalVoiceTime % 3600000) / 60000);
        const seconds = Math.floor((user.totalVoiceTime % 60000) / 1000);
        
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        let emoji = '';
        if (index === 0) emoji = '🥇';
        else if (index === 1) emoji = '🥈';
        else if (index === 2) emoji = '🥉';
        else emoji = `${index + 1}.`;
        
        embed.addFields({ 
          name: `${emoji} ${user.username}`, 
          value: `Toplam Süre: **${timeString}**`
        });
      });
      
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Top komut hatası:', error);
      await interaction.editReply({
        content: '❌ Kullanıcı istatistikleri alınırken bir hata oluştu!'
      });
    }
  }
};