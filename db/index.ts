import mongoose from 'mongoose';

mongoose
  .connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.info('Mongodb connected!'))
  .catch(e => {
    console.error('Mongodb connection error', e.message);
  });

module.exports = mongoose.connection;
