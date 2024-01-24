import SeatSchema from '../models/seat';

export const seatCreate = function (number: number, userId = undefined, available = true) {
  const seat = new SeatSchema(
    {
      _id: undefined,
      number,
      available,
      userId,
    },
    { timestamps: true },
  );

  return seat.save();
};

export const seatGetList = function () {
  return SeatSchema.find().populate({
    path: 'userId',
    select: 'fio',
  }).exec();
};

export const seatGetPermanentList = function () {
  return SeatSchema.find({
    available: true,
  }).populate({
    path: 'userId',
    select: 'fio',
  });
};
