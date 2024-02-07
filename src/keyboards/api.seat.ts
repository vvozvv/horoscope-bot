import { seatGetList } from '../db/controllers/seat-controller';
import { splitArray } from '../helpers/array';
import { Markup } from 'telegraf';

export const getFreeSeatKeyboard = async () => {
  const seats = await seatGetList();

  const keyboard = Markup.keyboard(
    splitArray(seats.filter(i => !i.available).map(i => String(i.number))),
  ).resize();

  return {
    seats,
    keyboard,
  };
};
