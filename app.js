const csvtojson = require("csvtojson");
const { Sequelize, Op } = require('sequelize');
const cron = require('node-cron');

require('dotenv').config()

const sequelize = new Sequelize(process.env.POSTGRES_CONN_STR, {
  logging: false
});

const Friend = require('./models/friend.model')(sequelize);

const initDb = async () => {
  await sequelize.sync();
};

const exportFriends = async () => {
  const friendsJSON = await csvtojson().fromFile('./samples/friends.csv');
  
  for (const friendJSON of friendsJSON) {
    try {
      const dateOfBirth = new Date(friendJSON.date_of_birth)

      await Friend.create({
        first_name: friendJSON.first_name,
        email: friendJSON.email,
        month_of_birth: dateOfBirth.getMonth(),
        day_of_birth: dateOfBirth.getDate(),
        phone_number: friendJSON.phone_number || null,
      })
    } catch (error) {
      const duplicateFriendExportAttempted = error?.errors?.[0]?.message === 'email must be unique'
      
      if (duplicateFriendExportAttempted) {
        console.warn(`Friend ${friendJSON.email} already exists, skipping...`)

        continue
      }

      throw error
    }
  }
}

const sendBirthdayNotifications = async () => {
  const dateNow = new Date()
  const friendsToSendNotificationsTo = await Friend.findAll({
    where: {
      day_of_birth: dateNow.getDate(),
      month_of_birth: dateNow.getMonth(),
      notification_sent_for_year: {
        [Op.or]: {
          [Op.eq]: null,
          [Op.lt]: dateNow.getFullYear()
        }
      }
    }
  })

  for (const friendToSendNotificationsTo of friendsToSendNotificationsTo) {
    friendToSendNotificationsTo.sendBirthdayNotification()
  }
}

const launchBirthdayNotificationScheduler = () => {
  cron.schedule('0 16 * * *', () => sendBirthdayNotifications())
}

(async () => {
  await initDb()
  await exportFriends()
  launchBirthdayNotificationScheduler()
  sendBirthdayNotifications()
})()
