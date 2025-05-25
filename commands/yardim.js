const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Bot komutları hakkında bilgi verir.'),
    
  execute: async (interaction) => {
    const embed = new EmbedBuilder()
      .setColor(0x5865F2)
      .setTitle(' Komut Listesi')
      .setDescription('Aşağıda botun tüm komutlarını bulabilirsiniz:')
      .addFields(
        { name: '/yardım', value: 'Bu yardım mesajını gösterir.' },
        { name: '/setup', value: 'Özel oda sistemini kurar. Kategori ve giriş kanalı oluşturur.' },
        { name: '/top', value: 'Ses kanallarında en çok vakit geçiren 10 kullanıcıyı listeler.' }
      )
      .setFooter({ text: 'Özel Oda Botu', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};