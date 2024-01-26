import { Markup, Scenes } from 'telegraf';
import {
  userGetList,
  userIsAdmin,
  userEditSeat,
} from '../db/controllers/user-controller';
import { SCENES } from '../constants/config';
import { splitArray } from '../helpers/array';
import { getMainMenu } from '../keyboards';
import { seatUpdate } from '../db/controllers/seat-controller';
import { getFreeSeatKeyboard } from '../keyboards/api.seat';

// TODO: any нужно как-то убрать, пока варинтов не нашел
const viewSeat = new Scenes.WizardScene<any>(
  SCENES.EDIT_USER,
  async ctx => {
    const users = await userGetList();
    const keyBoard = Markup.keyboard(
      splitArray(users.map(i => i.fio.split(' ')[0])),
    ).resize();
    await ctx.reply('Выберите пользователя', keyBoard);
    ctx.wizard.state.contactData = {
      users,
      isAdmin: userIsAdmin(ctx.update.message.chat.username),
    };
    return ctx.wizard.next();
  },
  async ctx => {
    const { users } = ctx.wizard.state.contactData;
    const secondName = ctx.message.text;
    const findedUser = users.find(i => i.fio.includes(secondName));

    if (!findedUser) {
      return ctx.scene.leave();
    }

    ctx.wizard.state.contactData.findedUser = findedUser;
    const keyBoard = Markup.keyboard([
      findedUser?.permanentBooking
        ? 'Удалить постоянное место'
        : 'Добавить постоянное место',
    ]).resize();
    await ctx.reply('Выберите действие', keyBoard);
    return ctx.wizard.next();
  },
  async ctx => {
    const operation = ctx.message.text;
    const { findedUser, isAdmin } = ctx.wizard.state.contactData;

    if (operation === 'Удалить постоянное место') {
      await userEditSeat(ctx.update.message.chat.username, null);
      await seatUpdate(findedUser?.permanentBooking?.number, null, false);
      await ctx.reply(
        `Постоянно место у ${findedUser.fio} удалено`,
        getMainMenu(isAdmin),
      );
      return ctx.scene.leave();
    }

    if (operation === 'Добавить постоянное место') {
      const { keyboard, seats } = await getFreeSeatKeyboard();
      ctx.wizard.state.contactData.seats = seats;

      await ctx.reply(`Выберите мето для бронированния`, keyboard);
      return ctx.wizard.next();
    }
  },
  async ctx => {
    const { seats, isAdmin, findedUser } = ctx.wizard.state.contactData;
    const seatText = ctx.message.text;
    const findedSeat = seats.find(i => Number(i.number) === Number(seatText));

    if (!findedSeat) {
      await ctx.reply(`Такого места нет`, getMainMenu(isAdmin));
      return ctx.scene.leave();
    }

    await userEditSeat(ctx.update.message.chat.username, findedSeat._id);
    await seatUpdate(findedSeat.number, findedUser?._id, true);
    await ctx.reply(
      `Постоянно место №${seatText} для ${findedUser.fio} забронированно`,
      getMainMenu(isAdmin),
    );
    return ctx.scene.leave();
  },
);

export default viewSeat;
