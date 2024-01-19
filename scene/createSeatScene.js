const { Scenes, Markup } = require('telegraf');
const { SCENES, ADMIN_IDS } = require('../constants/config');
const { getYesNoMenu, getMainMenu } = require('../keyboards/main');
const SeatController = require('../db/controllers/seat-controller');
const UserController = require('../db/controllers/user-controller');

const createSeat = new Scenes.WizardScene(
  SCENES.CREATE_SEAT,
  async ctx => {
    await ctx.reply('Создание места. Введите номер места');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next();
  },
  async ctx => {
    if (!ctx.message.text) {
      await ctx.reply('Некорретный номер');
      return;
    }

    ctx.wizard.state.contactData.seatNum = ctx.message.text;
    await ctx.reply('Место потоянно забронированно?', getYesNoMenu());
    return ctx.wizard.next();
  },
  async ctx => {
    const text = ctx.message.text.trim();

    if (text === 'Нет') {
      ctx.wizard.state.contactData.available = false;
      return ctx.wizard.next();
    }

    if (text === 'Да') {
      const users = await UserController.userGetList();
      ctx.wizard.state.contactData.users = users;
      ctx.wizard.state.contactData.available = true;
      await ctx.reply(
        'Выберите пользователя',
        Markup.keyboard(users.map(i => i.fio)).resize(),
      );
      return ctx.wizard.next();
    }
  },
  async ctx => {
    const { seatNum, available } = ctx.wizard.state.contactData;
    const currentUser = await UserController.userGetByTgLogin(
      ctx.update.message.chat.username,
    );
    const findedUser = ctx.wizard.state.contactData?.users?.find(
      i => i.fio === ctx.message.text,
    );
    const isAdmin = ADMIN_IDS.includes(currentUser.tgLogin);

    const createdSeat = await SeatController.seatCreate(
      seatNum,
      findedUser?._id,
      available,
    );

    if (createdSeat) {
      await ctx.reply(
        `Место ${ctx.wizard.state.contactData.seatNum} создано.`,
        getMainMenu(isAdmin),
      );
      return ctx.scene.leave();
    } else {
      await ctx.reply('Ошибка создания места', getMainMenu(isAdmin));
      return ctx.scene.leave();
    }
  },
);

module.exports = createSeat;
