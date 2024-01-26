import { Schema, model } from 'mongoose';

export interface UserModel {
  tgLogin: string;
  fio: string;
  permanentBooking?: any;
}

const userSchema = new Schema(
  {
    tgLogin: String,
    fio: String,
    permanentBooking: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: false,
    },
  },
  { timestamps: true },
);

export default model<UserModel>('User', userSchema);
