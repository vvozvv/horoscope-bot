import {Schema, model} from 'mongoose';

export interface SearModel {
  number: number;
  available: boolean;
  userId?: any;
}

const seatSchema = new Schema(
  {
    number: Number,
    available: Boolean,
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export default model<SearModel>('Seat', seatSchema);
