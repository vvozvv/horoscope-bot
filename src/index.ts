import express from 'express';
import { Telegraf, Scenes, session, Context } from 'telegraf';
import { getStartMenu } from './keyboards';
import db from './db';
import userRoutes from './routes/user-routes';
import { SCENES } from './constants/config';
import {
  editUser,
  createBookingScene,
  createSeatScene,
  deleteBookingScene,
  registrationScene,
  viewSeat,
  confirmedUser,
} from './scene';
import { seatGetList } from './db/controllers/seat-controller';
import { userGetList } from './db/controllers/user-controller';
import { bookingGetMyBook } from './db/controllers/booking-controller';
import { TOKEN, PORT } from './constants/config';
import {
  getDateInTwoWeeks,
  formatPrettyDate,
  daysOfWeek,
} from './helpers/date';

const app = express();
app.use(express.json());
app.use(userRoutes);

const stage = new Scenes.Stage([
  viewSeat,
  createSeatScene,
  createBookingScene,
  editUser,
  registrationScene,
  deleteBookingScene,
  confirmedUser,
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
bot.hears('Посмотреть мою бронь', async (ctx: Context) => {
  const booking = (await bookingGetMyBook()) as any[];
  let message = '';

  if (booking.length === 0) {
    message = `На ближайшие 2 недели (До ${formatPrettyDate(getDateInTwoWeeks())}) брони нет`;
  } else {
    message += 'Ваша бронь:\n\n';
    booking.forEach(i => {
      if (i?.dateBooking) {
        const currentDate = new Date(i?.dateBooking);
        message += `🗓 ${formatPrettyDate(currentDate)} (${daysOfWeek[currentDate.getDay()]})\n`;
        message += `Место: №${i?.reservedSeat?.number}\n\n`;
      }
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
bot.hears('Удалить бронь', Scenes.Stage.enter<any>(SCENES.DELETE_BOOKING));
bot.hears('Заявки в бота', Scenes.Stage.enter<any>(SCENES.CONFIRMED_USER));

// Можно обрабатывать обычный текст
bot.on('text', () => {});

bot.launch().then(() => console.log('bot launch'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`));
