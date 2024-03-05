import { Scenes, Markup } from 'telegraf';
import { SCENES } from '../constants/config';
import { getYesNoMenu, getMainMenu } from '../keyboards';
import { seatCreate } from '../db/controllers/seat-controller';
import {
  userGetList,
  userGetByTgLogin,
  userIsAdmin,
  userEditSeat,
} from '../db/controllers/user-controller';

// TODO: any нужно как-то убрать, пока варинтов не нашел
const createSeat = new Scenes.WizardScene<any>(
  SCENES.CREATE_SEAT,
  async ctx => {
    await ctx.reply('Создание места. Введите номер места');
    ctx.wizard.state.contactData = {};
    return ctx.wizard.next({
      reply_markup: { remove_keyboard: true },
    });
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
      const users = await userGetList(false);

      if (users.length !== 0) {
        ctx.wizard.state.contactData.users = users;
        ctx.wizard.state.contactData.available = true;
        await ctx.reply(
          'Выберите пользователя',
          Markup.keyboard(users.map(i => i.fio)).resize(),
        );
        return ctx.wizard.next();
      } else {
        await ctx.reply('Пользователей нет');
        return ctx.wizard.next();
      }
    }
  },
  async ctx => {
    const { seatNum, available } = ctx.wizard.state.contactData;
    const currentUser = (await userGetByTgLogin(
      ctx.update.message.chat.username,
    )) as any;
    const findedUser = ctx.wizard.state.contactData?.users?.find(
      i => i.fio === ctx.message.text,
    );
    const isAdmin = currentUser ? userIsAdmin(currentUser?.tgLogin) : false;

    const createdSeat = await seatCreate(seatNum, findedUser?._id, available);

    if (available) {
      await userEditSeat(ctx.update.message.chat.username, createdSeat?.id);
    }

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

export default createSeat;
