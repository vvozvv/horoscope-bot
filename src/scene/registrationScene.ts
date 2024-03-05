import { Markup, Scenes } from 'telegraf';
import {
  userGetByTgLogin,
  userCreate,
} from '../db/controllers/user-controller';
import { getYesNoMenu, getMainMenu } from '../keyboards';
import { SCENES } from '../constants/config';
import { getFreeSeatKeyboard } from '../keyboards/api.seat';
import { formatDate } from '../helpers/date';

const isFIO = /^[а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+$/;
const isDate =
  /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

// TODO: any нужно как-то убрать, пока варинтов не нашел
const contactDataWizard = new Scenes.WizardScene<any>(
  SCENES.REGISTRATION,
  async ctx => {
    const currentUser = await userGetByTgLogin(
      ctx.update.message.chat.username,
    );

    if (currentUser && currentUser.confirmed) {
      await ctx.reply(
        'Вы уже зарегистрированны',
        getMainMenu(currentUser.tgLogin === 'avazhov'),
      );
      return ctx.scene.leave();
    } else {
      await ctx.reply('Введите ФИО.\nПример: Иванов Иван Иванович', {
        reply_markup: { remove_keyboard: true },
      });
      ctx.wizard.state.contactData = {};
      return ctx.wizard.next();
    }
  },
  async ctx => {
    if (!isFIO.test(ctx.message.text)) {
      await ctx.reply(
        'Введеное ФИО не соответсвует маске.\nПример: Иванов Иван Иванович',
      );
      return;
    }
    ctx.wizard.state.contactData.fio = ctx.message.text;
    await ctx.reply(
      'Введите дату рождения в формате DD.MM.YYYY.\nПример: 24.03.1989',
    );
    return ctx.wizard.next();
  },
  async ctx => {
    const date = ctx.message.text;

    if (!isDate.test(date)) {
      await ctx.reply('Дата не соответсвует маске\nПример: 24.03.1989');
      return;
    }

    try {
      await userCreate(
        ctx.update.message.chat.username,
        ctx.wizard.state.contactData.fio,
        ctx.chat.id,
        ctx.wizard.state.contactData.birthday,
      );
      await ctx.reply('✅ Вы успешно зарегистрировались');
      await ctx.reply(
        'Дождитесь предоставления доступа в боту. Вам придет сообщение',
        {
          reply_markup: { remove_keyboard: true },
        },
      );
      return ctx.scene.leave();
    } catch (error) {
      console.log(error);
      await ctx.reply('Ошибка регистрации');
    }
  },
);

export default contactDataWizard;
