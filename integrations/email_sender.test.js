const sendBirthdayEmailToFriend = require('./email_sender');

const spies = {
  sendEmail: () => {}
}

jest.mock('postmark', () => {
  class ServerClient {
    sendEmail(...args) {
      spies.sendEmail(...args)
    }
  }
  
  return {
    ServerClient
  }
})

jest.spyOn(spies, "sendEmail");

test('sends an email to a friend', () => {
  sendBirthdayEmailToFriend({
    first_name: 'Klara',
    email: 'klara@example.com'
  })

  expect(spies.sendEmail).toHaveBeenCalledTimes(1);
  expect(spies.sendEmail).toHaveBeenCalledWith(
    expect.objectContaining(
      {
        "Subject": "Happy birthday!",
        "TextBody": "Happy birthday, dear Klara!",
        "To": "klara@example.com"
      }
    )
  );
});
