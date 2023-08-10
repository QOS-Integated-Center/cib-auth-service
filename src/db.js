const mongoose = require('mongoose');
const db_url = process.env.DB_URL;

const mongo = mongoose
  .connect(
    db_url,
    // `mongodb+srv://taron:${process.env.DB_PASSWORD}@cluster0.wuycowd.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true, 
      keepAliveInitialDelay: 300000 
    }
  )
  .then((con) => console.log('DB connection successful !'));

module.exports = { mongo: async() => await mongo };
