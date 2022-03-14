const { Model, DataTypes } = require('sequelize');
const sendBirthdayEmailToFriend = require('../integrations/email_sender')

module.exports = sequelize => {
  class Friend extends Model {}
  Friend.init({
    first_name: {
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
    month_of_birth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    day_of_birth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notification_sent_for_year: {
      type: DataTypes.INTEGER,
    },
    phone_number: {
      type: DataTypes.STRING,
      validate: {
        is: /^\+[\d\s]+$/i
      }
    },
  }, { sequelize, modelName: 'friend' });

  Friend.prototype.sendBirthdayNotification = async function () {
    const friend = this

    console.log(`Sending birthday notification to ${friend.email}`)

    sendBirthdayEmailToFriend(friend)
    // ... here can be SMS as well, can use Twilio
    
    const currentYear = (new Date()).getFullYear()

    await this.update({
      notification_sent_for_year: currentYear
    })
  }

  return Friend
}
