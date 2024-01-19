const mongoose = require('mongoose');

mongoose
  .connect('mongodb://127.0.0.1:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected!'))
  .catch(e => {
    console.error('Connection error', e.message);
  });

module.exports = mongoose.connection;
