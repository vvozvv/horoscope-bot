const SeatSchema = require('../models/seat');

exports.seatCreate = function (number, userId = undefined, available = true) {
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

exports.seatGetList = function () {
  return SeatSchema.find().populate({
    path: 'userId',
    select: 'fio',
  });
};

exports.seatGetPermanentList = function () {
  return SeatSchema.find({
    available: true,
  }).populate({
    path: 'userId',
    select: 'fio',
  });
};
