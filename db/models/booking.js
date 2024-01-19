const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    reservedSeat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seat',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    dateBooking: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model('Booking', bookingSchema);
