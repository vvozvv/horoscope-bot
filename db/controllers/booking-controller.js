const bookingSchema = require('../models/booking');

exports.bookingCreate = function (reservedSeat, user_id, date) {
  const book = new bookingSchema({
    reservedSeat,
    userId: user_id,
    dateBooking: date,
  });

  return book.save();
};

exports.bookingGetByDate = function (date) {
  return bookingSchema
    .find({
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
    });
};
