const { Scenes, Markup } = require('telegraf');
const { SCENES, ADMIN_IDS } = require('../constants/config');
const {
  getDatesMenu,
  getYesNoMenu,
  getMainMenu,
} = require('../keyboards/main');
const BookingController = require('../db/controllers/booking-controller');
const { parseDate } = require('../helpers/date');
const SeatController = require('../db/controllers/seat-controller');
const { splitArray, excludeArr } = require('../helpers/array');
const UserController = require('../db/controllers/user-controller');

const createBooking = new Scenes.WizardScene(
  SCENES.BOOKING,
  async ctx => {
    await ctx.reply('Выберите дату', getDatesMenu());
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  async ctx => {
    const date = ctx.message.text.split(' ')[0];

    const seats = await SeatController.seatGetList();
    const withoutAvaliable = seats.filter(i => !i.available).map(i => i.number);
    const bookingInDay = await BookingController.bookingGetByDate(
      parseDate(date),
    );
    ctx.wizard.state.contactData.day = date;
    ctx.wizard.state.contactData.date = parseDate(date);
    ctx.wizard.state.contactData.availablePlaces = seats.filter(
      i => !i.available,
    );

    const bookingIds = bookingInDay.map(i => i.reservedSeat?.number);
    const freeSeats = excludeArr(withoutAvaliable, bookingIds);

    if (freeSeats.length === 0) {
      await ctx.reply(`Свободных мест на ${date} нет.`, getMainMenu());
      return ctx.scene.leave();
    }

    await ctx.reply(
      `Доступные места на ${date}: \n\n ${freeSeats.map(i => `${i}, `)}`,
      Markup.keyboard(splitArray(freeSeats.map(i => `${i}`))).resize(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    const { availablePlaces } = ctx.wizard.state.contactData;

    if (
      !availablePlaces.map(i => i.number).includes(parseInt(ctx.message.text))
    ) {
      await ctx.reply('Этого места нет');
      return;
    }

    ctx.wizard.state.contactData.bookingNumber = ctx.message.text;
    await ctx.reply(
      `Вы хотите заборонировать место ${ctx.message.text}?`,
      getYesNoMenu(),
    );
    return ctx.wizard.next();
  },
  async ctx => {
    const text = ctx.message.text;
    const { availablePlaces, bookingNumber, day, date } =
      ctx.wizard.state.contactData;
    const currentUser = await UserController.userGetByTgLogin(
      ctx.update.message.chat.username,
    );
    const isAdmin = ADMIN_IDS.includes(currentUser.tgLogin);

    if (text === 'Да') {
      const findedSeat = availablePlaces.find(
        i => i.number === Number(bookingNumber),
      );
      await BookingController.bookingCreate(
        findedSeat?._id,
        currentUser?._id,
        date,
      );
      await ctx.reply(
        `✅ Место №${bookingNumber} забронированно на ${day}`,
        getMainMenu(isAdmin),
      );
      return ctx.scene.leave();
    }

    await ctx.reply(
      `🔴 Отмена бронирования места №${bookingNumber}.`,
      getMainMenu(isAdmin),
    );
    return ctx.scene.leave();
  },
);

module.exports = createBooking;
