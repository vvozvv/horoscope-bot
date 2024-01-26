const express = require('express');
import { Telegraf, Scenes, session, Context } from 'telegraf';
import { getStartMenu } from './keyboards';
const db = require('./db');
const userRoutes = require('./routes/user-routes');
import viewSeatWizard from './scene/viewSeat';
import { SCENES } from './constants/config';
import createSeat from './scene/createSeatScene';
import contactDataWizard from './scene/registrationScene';
import createBooking from './scene/createBookingScene';
import editUserScene from './scene/editUser';
import { seatGetList } from './db/controllers/seat-controller';
import { userGetList } from './db/controllers/user-controller';
const { TOKEN, PORT } = require('./config');

const app = express();
app.use(express.json());
app.use(userRoutes);

const stage = new Scenes.Stage([
  contactDataWizard,
  viewSeatWizard,
  createSeat,
  createBooking,
  editUserScene,
]);

const bot = new Telegraf(TOKEN);
bot.use(session());
bot.use(stage.middleware() as any);

bot.start((ctx: any) => {
  ctx.reply('Привет! Давай бронировать', getStartMenu());
});

bot.hears('Информация о местах', async (ctx: Context) => {
  const seats = (await seatGetList()) as any[];
  let message = '';

  if (seats.length === 0) {
    message = 'Места еще не добавили';
  } else {
    seats.forEach(i => {
      message += `${i.userId ? '🔴' : '🟢'} Место: ${i.number}. Постоянное: ${i.available ? 'Да' : 'Нет'}\n`;
      message += i.userId ? `Кем забронировано: ${i.userId.fio}\n\n` : '\n';
    });
  }

  return ctx.reply(message);
});
bot.hears('Информация о пользователях', async (ctx: Context) => {
  const users = await userGetList();
  let message = '';

  if (users.length === 0) {
    message = 'Пользователей нет';
  } else {
    users.forEach(i => {
      message += `${i.fio}\n`;
      message += `@${i.tgLogin} ${i.permanentBooking?.number ? '• 🔴' + i.permanentBooking?.number : ''}\n\n`;
    });
  }

  return ctx.reply(message);
});
bot.hears('Посмотреть места', Scenes.Stage.enter<any>(SCENES.VIEW_BOOKING));
bot.hears('Добавить место', Scenes.Stage.enter<any>(SCENES.CREATE_SEAT));
bot.hears('Забронировать место', Scenes.Stage.enter<any>(SCENES.BOOKING));
bot.hears('Зарегистрироваться', Scenes.Stage.enter<any>(SCENES.REGISTRATION));
bot.hears(
  'Редактирование пользователя',
  Scenes.Stage.enter<any>(SCENES.EDIT_USER),
);

// Можно обрабатывать обычный текст
bot.on('text', () => {});

bot.launch();
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`));
