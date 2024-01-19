const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    tgLogin: String,
    fio: String,
    permanentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);
