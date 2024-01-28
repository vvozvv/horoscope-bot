import { Scenes, Markup } from 'telegraf';
import { SCENES } from '../constants/config';
import {
  formatPrettyDate,
  daysOfWeek,
  getDateFromTheString,
} from '../helpers/date';
import {
  bookingGetMyBook,
  bookingDeleteById,
} from '../db/controllers/booking-controller';
import { getMainMenu, getYesNoMenu } from '../keyboards';
import { userIsAdmin } from '../db/controllers/user-controller';

// TODO: any нужно как-то убрать, пока варинтов не нашел
const deleteBookingScene = new Scenes.WizardScene<any>(
  SCENES.DELETE_BOOKING,
  async ctx => {
    const booking = (await bookingGetMyBook()) as any[];
    const buttons: string[] = [];
    let message = '';

    booking.forEach(i => {
      if (i?.dateBooking) {
        const currentDate = new Date(i?.dateBooking);
        message += `🗓 ${formatPrettyDate(currentDate)} (${daysOfWeek[currentDate.getDay()]})\n`;
        message += `Место: №${i?.reservedSeat?.number}\n\n`;
        buttons.push(
          `${formatPrettyDate(currentDate)} (${daysOfWeek[currentDate.getDay()]}). Место: №${i?.reservedSeat?.number}`,
        );
      }
    });

    await ctx.reply('Выберите дату для удаления брони. \nВы бронировали:');
    await ctx.reply(message, Markup.keyboard(buttons).resize());

    ctx.wizard.state.contactData = { booking };
    return ctx.wizard.next();
  },

  async ctx => {
    const text = ctx.message.text;

    ctx.wizard.state.contactData.selectDate = getDateFromTheString(
      text?.split('. ')[0],
    );
    ctx.wizard.state.contactData.selectSeat = text
      ?.split('. ')[2]
      .replace(/[^\w\s!?]/g, '')
      .trim();
    await ctx.reply(
      `Вы действительно хотите удалить бронь на ${text?.split('. ')[0]}`,
      getYesNoMenu(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    const { booking, selectSeat, selectDate } = ctx.wizard.state.contactData;
    const text = ctx.message.text;
    const isAdmin = userIsAdmin(ctx.update.message.chat.username);

    if (text === 'Да') {
      const finded = booking.find(
        i =>
          i?.reservedSeat?.number === Number(selectSeat) &&
          new Date(i?.dateBooking).toISOString().split('T')[0] ===
            selectDate.toISOString().split('T')[0],
      );

      if (finded) {
        await bookingDeleteById(finded._id);
        await ctx.reply(`Бронь удалена`, getMainMenu(isAdmin));
        return ctx.scene.leave();
      } else {
        await ctx.reply(`Не удалось удалить бронь`, getMainMenu(isAdmin));
        return ctx.scene.leave();
      }
    }
    if (text === 'Нет') {
      await ctx.reply(`Отмена брони`, getMainMenu(isAdmin));
      return ctx.scene.leave();
    }
  },
);

export default deleteBookingScene;
