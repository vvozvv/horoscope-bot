import { Scenes } from 'telegraf';
import { getDatesMenu, getMainMenu } from '../keyboards';
import {
  parseDate,
  formatDateToRu,
  daysOfWeek,
  isBirthday,
} from '../helpers/date';
import { bookingGetByDate } from '../db/controllers/booking-controller';
import {
  seatGetList,
  seatGetPermanentList,
} from '../db/controllers/seat-controller';
import { excludeArr } from '../helpers/array';
import { userIsAdmin } from '../db/controllers/user-controller';
import { converterSvgToPng } from '../helpers/converter';
import { convertToSeats } from '../helpers/object';
import { SCENES } from '../constants/config';

// TODO: any нужно как-то убрать, пока варинтов не нашел
const viewSeat = new Scenes.WizardScene<any>(
  SCENES.VIEW_BOOKING,
  async ctx => {
    await ctx.reply('Выберите дату', getDatesMenu());
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === '↩ Назад') {
      await ctx.reply(
        'Отмена просмотра мест. ',
        getMainMenu(userIsAdmin(ctx.update.message.chat.username)),
      );
      return ctx.scene.leave();
    }

    const date = ctx.message.text.split(' ')[0];
    let message = ``;

    const seats = await seatGetList();
    const withoutAvailable = seats.filter(i => !i.available).map(i => i.number);
    const bookingInDay = (await bookingGetByDate(parseDate(date))) as any;
    const permanentSeats = await seatGetPermanentList();
    const bookingIds = bookingInDay.map(i => i.reservedSeat?.number) as any;
    const freeSeat = excludeArr(withoutAvailable, bookingIds);

    message += `${formatDateToRu(date)}, ${daysOfWeek[parseDate(date).getDay()]}\n\n`;
    message += `🔴 Забронированные места:\n`;
    bookingInDay.forEach(i => {
      const isBirthdayDay = i.userId.birthday && isBirthday(i.userId.birthday);

      const fio = i?.userId?.fio?.split(' ');
      message += `${i?.reservedSeat?.number} - ${fio?.[0]} ${fio[1][0]}.${fio[2][0]} ${isBirthdayDay ? '🎂' : ''} \n`;
    });

    message += `\n\n🟢 Свободные места: \n`;
    freeSeat.forEach(i => {
      message += `${i}, `;
    });

    await converterSvgToPng(
      parseDate(date),
      convertToSeats(freeSeat, bookingInDay, permanentSeats),
      ctx,
    );

    await ctx.reply(
      message,
      getMainMenu(userIsAdmin(ctx.update.message.chat.username)),
    );
    return ctx.scene.leave();
  },
);

export default viewSeat;
