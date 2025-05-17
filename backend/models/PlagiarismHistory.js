// models/PlagiarismHistory.js
module.exports = (sequelize, DataTypes) => {
  const PlagiarismHistory = sequelize.define('PlagiarismHistory', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // match your `file_name` column
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'file_name',
    },
    // match your `plagiarism_percentage` column
    plagiarismPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'plagiarism_percentage',
    },
    // match your `user_id` column
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
    
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
  }, {
    tableName: 'plagiarism_history', 
    timestamps: false                 
  });

  PlagiarismHistory.associate = (models) => {
    PlagiarismHistory.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return PlagiarismHistory;
};
