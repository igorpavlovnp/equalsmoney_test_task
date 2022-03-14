Given that these are friends of a single person, we would not consider it as an amount that would require queues, heavy indexing etc. We would keep it simple.

We would need a database because we would need to somehow mark that the birthday notification was already sent for a particular year for a particular friend. We would create a script that would take the given CSV and load into a database.

We would create a Notification class with a constructor and methods to send an email or an sms. Then we would be able to test this class and its methods.

# Stack

- Node server
- PostgreSQL
- Sequelize ORM
- node-cron for scheduling 
- Jest for testing
