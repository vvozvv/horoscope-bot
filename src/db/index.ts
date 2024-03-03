import mongoose from 'mongoose';

mongoose

  .connect(
    'mongodb://89.223.123.163:2717/psb-booking-db',
  )
  .then(() => console.info('Mongodb connected!'))
  .catch(e => {
    console.error('Mongodb connection error', e.message);
  });

export default mongoose.connection;
