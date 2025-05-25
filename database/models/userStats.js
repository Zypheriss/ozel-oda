const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  guildId: { 
    type: String, 
    required: true,
    index: true
  },
  username: { 
    type: String, 
    required: true 
  },
  totalVoiceTime: { 
    type: Number, 
    default: 0,
    min: 0
  },
  joinedAt: { 
    type: Date, 
    default: null 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  channelsJoined: {
    type: Number,
    default: 0,
    min: 0
  },
  lastChannel: {
    type: String,
    default: null
  },
  weeklyVoiceTime: {
    type: Number,
    default: 0,
    min: 0
  },
  monthlyVoiceTime: {
    type: Number,
    default: 0,
    min: 0
  }
});
userStatsSchema.index({ userId: 1, guildId: 1 }, { unique: true });
userStatsSchema.methods.calculateStats = function() {
  const now = new Date();
  const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  if (this.lastUpdated > oneWeekAgo) {
    this.weeklyVoiceTime = this.totalVoiceTime;
  }
  
  if (this.lastUpdated > oneMonthAgo) {
    this.monthlyVoiceTime = this.totalVoiceTime;
  }
};
userStatsSchema.methods.updateVoiceTime = function(duration) {
  this.totalVoiceTime += duration;
  this.weeklyVoiceTime += duration;
  this.monthlyVoiceTime += duration;
  this.lastUpdated = new Date();
  this.channelsJoined += 1;
};
userStatsSchema.methods.updateChannel = function(channelId) {
  this.lastChannel = channelId;
  this.lastUpdated = new Date();
};
userStatsSchema.pre('save', function(next) {
  this.calculateStats();
  next();
});

module.exports = mongoose.model('UserStats', userStatsSchema);