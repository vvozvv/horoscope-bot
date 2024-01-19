const { Scenes } = require('telegraf');
const UserController = require('../db/controllers/user-controller');
const { getYesNoMenu, getMainMenu } = require('../keyboards/main');
const { SCENES } = require('../constants/config');

const isFIO = /^[а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+ [а-яА-ЯёЁa-zA-Z]+$/;

const contactDataWizard = new Scenes.WizardScene(
  SCENES.REGISTRATION,
  async ctx => {
    const currentUser = await UserController.userGetByTgLogin(
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
    // validation example
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
      return ctx.wizard.next();
    }

    return ctx.wizard.next();
  },
  async ctx => {
    ctx.wizard.state.contactData.email = ctx.message.text;

    try {
      const createdUser = await UserController.userCreate(
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

module.exports = contactDataWizard;
