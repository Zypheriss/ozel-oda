const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { categoryName, joinChannelName } = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Özel oda sistemini kurar.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  execute: async (interaction) => {
    const { guild } = interaction;
    await interaction.deferReply({ ephemeral: true });
    
    try {
      let category = guild.channels.cache.find(c => c.name === categoryName && c.type === 4);
      
      if (!category) {
        category = await guild.channels.create({
          name: categoryName,
          type: 4,
          permissionOverwrites: [
            {
              id: guild.id,
              allow: [PermissionFlagsBits.ViewChannel],
            }
          ]
        });
      }
      let joinChannel = guild.channels.cache.find(
        c => c.name === joinChannelName && c.type === 2 && c.parentId === category.id
      );
      
      if (!joinChannel) {
        joinChannel = await guild.channels.create({
          name: joinChannelName,
          type: 2,
          parent: category,
          permissionOverwrites: [
            {
              id: guild.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
            }
          ]
        });
      }
      
      const successEmbed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle('✅ Kurulum Tamamlandı')
        .setDescription(`Özel oda sistemi başarıyla kuruldu!\n\n**Kategori:** ${category.name}\n**Katılım Kanalı:** ${joinChannel.name}`)
        .setFooter({ text: 'Kullanıcılar katılım kanalına girerek özel oda oluşturabilirler.' })
        .setTimestamp();
      
      await interaction.editReply({ embeds: [successEmbed] });
    } catch (error) {
      console.error('Setup hatası:', error);
      
      const errorEmbed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle('❌ Kurulum Başarısız')
        .setDescription(`Kurulum sırasında bir hata oluştu: ${error.message}`)
        .setTimestamp();
      
      await interaction.editReply({ embeds: [errorEmbed] });
    }
  }
};