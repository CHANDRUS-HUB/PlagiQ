module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'users',
    timestamps: false, // If you don't want Sequelize to handle createdAt/updatedAt
  });

  // Define associations for the User model
  User.associate = (models) => {
    User.hasMany(models.PlagiarismHistory, {
      foreignKey: 'user_id',
      as: 'plagiarismHistory',
    });
  };

  return User;
};
