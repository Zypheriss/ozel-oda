const mongoose = require('mongoose');
const { mongoUri } = require('../config.json');

module.exports = {
  connectDatabase: async () => {
    try {
      await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
};