const csvtojson = require("csvtojson");
const { Sequelize } = require('sequelize');

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
      await Friend.create(friendJSON)
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

(async () => {
  await initDb()
  await exportFriends()
})()
