const mongoose = require('mongoose');

const seatSchema = mongoose.Schema(
  {
    number: Number,
    available: Boolean,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Seat', seatSchema);
