const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { categoryName, joinChannelName } = require('../config.json');
const UserStats = require('../database/models/userStats');
const { createControlPanel } = require('../utils/channelManager');

module.exports = {
  name: 'voiceStateUpdate',
  execute: async (oldState, newState, client) => {
    if (oldState.channelId && !newState.channelId) {
      try {
        const user = await UserStats.findOne({
          userId: oldState.id,
          guildId: oldState.guild.id
        });
        
        if (user && user.joinedAt) {
          const leaveTime = new Date();
          const joinTime = user.joinedAt;
          const duration = leaveTime - joinTime;
          
          await user.updateVoiceTime(duration);
          user.joinedAt = null;
          await user.save();
          
          console.log(`${user.username} kullanıcısının ses süresi güncellendi: +${duration}ms`);
        }
      } catch (error) {
        console.error('Kullanıcı istatistiği güncelleme hatası:', error);
      }
    }
    if (!oldState.channelId && newState.channelId) {
      try {
        let user = await UserStats.findOne({
          userId: newState.id,
          guildId: newState.guild.id
        });
        
        if (!user) {
          const member = newState.member;
          user = new UserStats({
            userId: newState.id,
            guildId: newState.guild.id,
            username: member.user.tag,
            joinedAt: new Date()
          });
        } else {
          user.joinedAt = new Date();
          user.updateChannel(newState.channelId);
        }
        
        await user.save();
      } catch (error) {
        console.error('Kullanıcı istatistiği başlatma hatası:', error);
      }
    }
    try {
      const { guild, member } = newState;
      
      const category = guild.channels.cache.find(
        c => c.name === categoryName && c.type === ChannelType.GuildCategory
      );
      
      if (!category) return;
      const joinChannel = guild.channels.cache.find(
        c => c.name === joinChannelName && c.parentId === category.id
      );
      
      if (!joinChannel) return;
      if (newState.channelId === joinChannel.id) {
        const channelName = member.user.username
          .replace(/[^\w-]/g, '') 
          .substring(0, 15); 
        
        const voiceChannel = await guild.channels.create({
          name: channelName,
          type: ChannelType.GuildVoice,
          parent: category,
          permissionOverwrites: [
            {
              id: guild.id,
              allow: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: member.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.Connect,
                PermissionFlagsBits.Speak,
                PermissionFlagsBits.Stream,
                PermissionFlagsBits.UseVAD,
                PermissionFlagsBits.PrioritySpeaker,
                PermissionFlagsBits.MuteMembers,
                PermissionFlagsBits.DeafenMembers,
                PermissionFlagsBits.MoveMembers
              ]
            }
          ]
        });
        
        await member.voice.setChannel(voiceChannel);
        
        client.voiceChannels.set(voiceChannel.id, {
          ownerId: member.id,
          isLocked: false,
          isHidden: false
        });
        await createControlPanel(voiceChannel, member);
      }
      if (
        oldState.channel && 
        oldState.channel.parentId === category.id && 
        oldState.channel.id !== joinChannel.id && 
        oldState.channel.members.size === 0
      ) {
        setTimeout(async () => {
          const channel = guild.channels.cache.get(oldState.channelId);
          if (channel && channel.members.size === 0) {
            client.voiceChannels.delete(channel.id);
            await channel.delete().catch(console.error);
            console.log(`Boş kanal silindi: ${channel.name}`);
          }
        }, 2000); 
      }
    } catch (error) {
      console.error('Özel oda yönetim hatası:', error);
    }
  }
};