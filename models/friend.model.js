const { Model, DataTypes } = require('sequelize');

module.exports = sequelize => {
  class Friend extends Model {}
  Friend.init({
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^\S+@\S+\.\S+$/i
      }
    },
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notification_sent_for_year: {
      type: DataTypes.INTEGER,
    },
  }, { sequelize, modelName: 'friend' });

  return Friend
}
