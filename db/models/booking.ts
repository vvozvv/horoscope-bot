import { Schema, model, Types } from 'mongoose';

export interface BookingModel {
  reservedSeat: Types.ObjectId;
  userId: Types.ObjectId;
  dateBooking?: Date;
}

const bookingSchema = new Schema(
  {
    reservedSeat: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    dateBooking: Date,
  },
  { timestamps: true },
);

export default model<BookingModel>('Booking', bookingSchema);
