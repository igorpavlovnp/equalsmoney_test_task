const { Model, DataTypes } = require('sequelize');
const postmark = require("postmark");
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

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
  }, { sequelize, modelName: 'friend' });

  Friend.prototype.sendBirthdayNotification = async function () {
    const friend = this

    console.log(`Sending birthday notification to ${friend.email}`)

    try {
      await postmarkClient.sendEmail({
        From: process.env.POSTMARK_SENDER_EMAIL_ADDRESS,
        To: friend.email,
        Subject: "Happy birthday!",
        TextBody: `Happy birthday, dear ${friend.first_name}!`
      });
    } catch (error) {
      console.log(`Could not send a birthday notification to ${friend.email}, will try again next year.`)

      return
    }
    
    const currentYear = (new Date()).getFullYear()

    await this.update({
      notification_sent_for_year: currentYear
    })
  }

  return Friend
}
