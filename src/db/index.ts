import mongoose from 'mongoose';

mongoose

  .connect(
    'mongodb://mongodb:27017/psb-booking-db',
  )
  .then(() => console.info('Mongodb connected!'))
  .catch(e => {
    console.error('Mongodb connection error', e.message);
  });

export default mongoose.connection;
