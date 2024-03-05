import mongoose from 'mongoose';

mongoose

  .connect('mongodb://localhost:21117/psb-booking-db')
  .then(() => console.info('Mongodb connected!'))
  .catch(e => {
    console.error('Mongodb connection error', e.message);
  });

export default mongoose.connection;
