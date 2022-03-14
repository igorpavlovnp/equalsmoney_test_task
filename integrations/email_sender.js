const postmark = require("postmark");
const postmarkClient = new postmark.ServerClient(process.env.POSTMARK_API_KEY);

const sendBirthdayEmailToFriend = async friend => {
  try {
    await postmarkClient.sendEmail({
      From: process.env.POSTMARK_SENDER_EMAIL_ADDRESS,
      To: friend.email,
      Subject: "Happy birthday!",
      TextBody: `Happy birthday, dear ${friend.first_name}!`
    });
  } catch (error) {
    console.log(`Could not send a birthday notification to ${friend.email}, will try again next year.`)
  }
}

module.exports = sendBirthdayEmailToFriend
