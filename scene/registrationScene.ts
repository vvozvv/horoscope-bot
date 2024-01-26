import { Scenes } from 'telegraf';
import {
  userGetByTgLogin,
  userCreate,
} from '../db/controllers/user-controller';
import { getYesNoMenu, getMainMenu } from '../keyboards';
import { SCENES } from '../constants/config';

const isFIO = /^[а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+$/;

// TODO: any нужно как-то убрать, пока варинтов не нашел
const contactDataWizard = new Scenes.WizardScene<any>(
  SCENES.REGISTRATION,
  async ctx => {
    const currentUser = await userGetByTgLogin(
      ctx.update.message.chat.username,
    );

    if (currentUser) {
      await ctx.reply(
        'Вы уже зарегистрированны',
        getMainMenu(currentUser.tgLogin === 'avazhov'),
      );
      return ctx.scene.leave();
    } else {
      await ctx.reply('Введите ФИО. Пример: Иванов Иван Иванович');
      ctx.wizard.state.contactData = {};
      return ctx.wizard.next();
    }
  },
  async ctx => {
    if (!isFIO.test(ctx.message.text)) {
      await ctx.reply(
        'Введеное ФИО не соответсвует маске. Пример: Иванов Иван Иванович',
      );
      return;
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    await ctx.reply('У вас есть постояное место?', getYesNoMenu());
    return ctx.wizard.next();
  },
  async ctx => {
    if (ctx.message.text === 'Да') {
      await ctx.reply('Введите место');
      // todo: добавить логику отображение мест для бронирования
      return ctx.wizard.next();
    }

    return ctx.wizard.next();
  },
  async ctx => {
    ctx.wizard.state.contactData.email = ctx.message.text;

    try {
      const createdUser = await userCreate(
        ctx.update.message.chat.username,
        ctx.wizard.state.contactData.fio,
      );
      await ctx.reply(
        'Вы успешно зарегистрировались',
        getMainMenu(createdUser.tgLogin === 'avazhov'),
      );
      return ctx.scene.leave();
    } catch (error) {
      console.log(error);
      await ctx.reply('Ошибка регистрации');
    }
  },
);

export default contactDataWizard;
