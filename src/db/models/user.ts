import { Schema, model } from 'mongoose';

export interface UserModel {
  tgLogin: string;
  fio: string;
  chatId: string;
  confirmed: string;
  permanentBooking?: any;
  birthday?: Date;
  createdAt?: Date;
}

const userSchema = new Schema(
  {
    tgLogin: String,
    fio: String,
    chatId: String,
    permanentBooking: {
      type: Schema.Types.ObjectId,
      ref: 'Seat',
      required: false,
    },
    birthday: Date,
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default model<UserModel>('User', userSchema);
