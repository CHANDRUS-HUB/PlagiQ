// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

const UserFactory               = require('./User');
const PlagiarismHistoryFactory  = require('./PlagiarismHistory');
const UserLogFactory            = require('./UserLogs');

const User              = UserFactory(sequelize, DataTypes);
const PlagiarismHistory = PlagiarismHistoryFactory(sequelize, DataTypes);
const UserLog           = UserLogFactory(sequelize, DataTypes);

// Set up associations
if (User.associate)              User.associate({ PlagiarismHistory, UserLog });
if (PlagiarismHistory.associate) PlagiarismHistory.associate({ User });
if (UserLog.associate)           UserLog.associate({ User });

module.exports = { sequelize, Sequelize, User, PlagiarismHistory, UserLog };
