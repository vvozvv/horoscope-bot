import { Markup, Scenes } from 'telegraf';
import { getMainMenu } from '../keyboards';
import { formatPrettyDate } from '../helpers/date';
import {
  userEditSeat,
  userGetById,
  userGetList,
  userIsAdmin,
} from '../db/controllers/user-controller';
import { SCENES } from '../constants/config';
import { UserModel } from '../db/models/user';

// TODO: any нужно как-то убрать, пока варинтов не нашел
const confirmedUser = new Scenes.WizardScene<any>(
  SCENES.CONFIRMED_USER,
  async ctx => {
    const users = await userGetList(undefined, false);
    ctx.wizard.state.contactData = {
      isAdmin: userIsAdmin(ctx.update.message.chat.username),
      users,
    };

    if (users.length === 0) {
      await ctx.reply(
        'Заявок нет',
        userIsAdmin(ctx.update.message.chat.username),
      );
      return ctx.scene.leave();
    } else {
      await ctx.reply('Выберите пользователя, чтобы подтвердить его в боте.');
      await ctx.reply(
        'Список заявок:',
        Markup.keyboard(
          users.map(
            (item, idx) =>
              `${idx + 1}. ${item.fio.split(' ')[0]} (${item.tgLogin}). Дата заявки: ${formatPrettyDate(item?.createdAt)}`,
          ),
        ).resize(),
      );

      return ctx.wizard.next();
    }
  },
  async ctx => {
    const { isAdmin, users } = ctx.wizard.state.contactData;
    const text = ctx.message.text;

    if (text === '↩ Назад') {
      await ctx.reply(`Главное меню: `, getMainMenu(isAdmin));
      return ctx.scene.leave();
    }

    const tgLogin = text.match(/\((.+?)\)/)[1];
    const findedUser = users?.find(i => i.tgLogin === tgLogin);
    const user = (await userGetById(findedUser?._id)) as UserModel;

    if (findedUser) {
      await userEditSeat(tgLogin, undefined, true);
      await ctx.reply(
        `Пользователь ${tgLogin} подтвержден`,
        getMainMenu(isAdmin),
      );
      await ctx.telegram.sendMessage(
        user?.chatId,
        '✅ Вам предоставлен доступ к боту',
        getMainMenu(isAdmin),
      );
      return ctx.scene.leave();
    } else {
      await ctx.reply(
        `Не удалось подтвердить пользователя ${tgLogin}. Попробуйте снова`,
        getMainMenu(isAdmin),
      );
      return ctx.scene.leave();
    }
  },
);

export default confirmedUser;
