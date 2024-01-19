const { Scenes } = require('telegraf');
const path = require('path');
const fs = require('fs');
const { getDatesMenu, getMainMenu } = require('../keyboards/main');
const { parseDate, formatDateToRu, daysOfWeek } = require('../helpers/date');
const BookingController = require('../db/controllers/booking-controller');
const SeatController = require('../db/controllers/seat-controller');
const { excludeArr } = require('../helpers/array');
const { userIsAdmin } = require('../db/controllers/user-controller');
const { converterSvgToPng } = require('../helpers/converter');
const { convertToSeats } = require('../helpers/object');
const { SCENES } = require('../constants/config');

const viewSeat = new Scenes.WizardScene(
  SCENES.VIEW_BOOKING,
  async ctx => {
    await ctx.reply('Выберите дату', getDatesMenu());
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === '↩ Назад') {
      return ctx.scene.leave();
    }

    const date = ctx.message.text.split(' ')[0];
    let message = ``;

    const seats = await SeatController.seatGetList();
    const withoutAvailable = seats.filter(i => !i.available).map(i => i.number);
    const bookingInDay = await BookingController.bookingGetByDate(
      parseDate(date),
    );
    const permanentSeats = await SeatController.seatGetPermanentList();
    const currentDataFileName = path.resolve(
      `assets/${parseDate(date).toISOString().split('T')[0]}.png`,
    );

    const bookingIds = bookingInDay.map(i => i.reservedSeat?.number);
    const freeSeat = excludeArr(withoutAvailable, bookingIds);

    message += `${formatDateToRu(date)}, ${daysOfWeek[parseDate(date).getDay()]}\n\n`;

    message += `🔴 Забронированные места:\n`;
    bookingInDay.forEach(i => {
      const fio = i?.userId?.fio?.split(' ');
      message += `${i?.reservedSeat?.number} - ${fio[0]} ${fio[1][0]}.${fio[2][0]}\n`;
    });

    message += `\n\n🟢 Свободные места: \n`;
    freeSeat.forEach(i => {
      message += `${i}, `;
    });

    if (fs.existsSync(currentDataFileName)) {
      await ctx.replyWithPhoto({ source: currentDataFileName });
    } else {
      await converterSvgToPng(
        parseDate(date),
        convertToSeats(freeSeat, bookingInDay, permanentSeats),
        ctx,
      );
    }

    await ctx.reply(
      message,
      getMainMenu(userIsAdmin(ctx.update.message.chat.username)),
    );
    return ctx.scene.leave();
  },
);

module.exports = viewSeat;
