module.exports = (sequelize, DataTypes) => {
  const UserLog = sequelize.define('UserLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    action: {
      type: DataTypes.ENUM('login', 'file_check'),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'user_logs',
    timestamps: false,
  });

  UserLog.associate = (models) => {
    UserLog.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  };

  return UserLog;
};
