import BookingSchema from '../models/booking';
import { Types } from 'mongoose';
import { getDateInTwoWeeks } from '../../helpers/date';

export const bookingCreate = function (
  reservedSeat: string,
  user_id: Types.ObjectId | undefined,
  date: string | Date,
) {
  const book = new BookingSchema({
    reservedSeat,
    userId: user_id,
    dateBooking: date,
  });

  return book.save();
};

export const bookingGetByDate = function (date: string | Date) {
  return BookingSchema.find({
    dateBooking: {
      $gte: date,
      $lte: date,
    },
  })
    .populate({
      path: 'reservedSeat',
    })
    .populate({
      path: 'userId',
    })
    .exec();
};

export const bookingGetMyBook = function () {
  const futureDate = getDateInTwoWeeks();

  return BookingSchema.find({
    dateBooking: {
      $gte: new Date(),
      $lte: futureDate,
    },
  })
    .populate({
      path: 'reservedSeat',
    })
    .exec();
};
