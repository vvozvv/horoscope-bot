import mongoose from 'mongoose';

mongoose
  // .connect('mongodb://127.0.0.1:27017/psb-booking-db')
  .connect('mongodb://gen_user:I(0l_d_%2Fhdr%24%255@147.45.107.117:27017/default_db?authSource=admin&directConnection=true')
  .then(() => console.info('Mongodb connected!'))
  .catch(e => {
    console.error('Mongodb connection error', e.message);
  });

export default mongoose.connection;
