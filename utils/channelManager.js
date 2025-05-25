const { 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require('discord.js');
const createControlPanel = async (channel, member) => {
  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🔐 Özel Oda Kontrol Paneli')
    .setDescription(`<@${member.id}>, özel odanız oluşturuldu! Aşağıdaki kontrolleri kullanarak odanızı yönetebilirsiniz:`)
    .setTimestamp();
  const row1 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('lockRoom_' + channel.id)
      .setLabel('Odayı Kilitle')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('🔒'),
    
    new ButtonBuilder()
      .setCustomId('hideRoom_' + channel.id)
      .setLabel('Odayı Gizle')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('👁️')
  );
  
  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('addMember_' + channel.id)
      .setLabel('Üye Ekle')
      .setStyle(ButtonStyle.Success)
      .setEmoji('➕'),
    
    new ButtonBuilder()
      .setCustomId('changeName_' + channel.id)
      .setLabel('İsmini Değiştir')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('<:__:1373698038853275709>'),
    
    new ButtonBuilder()
      .setCustomId('changeLimit_' + channel.id)
      .setLabel('Limitini Değiştir')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('<:__:1373698038853275709>')
  );
  
  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('banMember_' + channel.id)
      .setLabel('Üye Yasakla')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('<:zypCeza:1372505913293934623>'),
    
    new ButtonBuilder()
      .setCustomId('manageRoom_' + channel.id)
      .setLabel('Odayı Yönet')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('⚙️')
  );
  
  return channel.send({
    content: `<@${member.id}>`,
    embeds: [embed],
    components: [row1, row2, row3]
  });
};

const createRenameModal = (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId('roomName_' + interaction.channel.id)
    .setTitle('Oda İsmini Değiştir');
  
  const roomNameInput = new TextInputBuilder()
    .setCustomId('roomNameInput')
    .setLabel('Odanın Yeni İsmini Gir')
    .setPlaceholder(interaction.channel.name)
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(30);
  
  const firstActionRow = new ActionRowBuilder().addComponents(roomNameInput);
  modal.addComponents(firstActionRow);
  
  return modal;
};

const createLimitModal = (interaction) => {
  const modal = new ModalBuilder()
    .setCustomId('roomLimit_' + interaction.channel.id)
    .setTitle('Oda Limitini Değiştir');
  
  const roomLimitInput = new TextInputBuilder()
    .setCustomId('roomLimitInput')
    .setLabel('Odanın Yeni Limitini Gir (0-99)')
    .setPlaceholder(interaction.channel.userLimit.toString())
    .setRequired(true)
    .setStyle(TextInputStyle.Short)
    .setMinLength(1)
    .setMaxLength(2);
  
  const firstActionRow = new ActionRowBuilder().addComponents(roomLimitInput);
  modal.addComponents(firstActionRow);
  
  return modal;
};

module.exports = {
  createControlPanel,
  createRenameModal,
  createLimitModal
};