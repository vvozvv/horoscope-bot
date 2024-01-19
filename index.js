const express = require('express');
const { Telegraf, Scenes, session } = require('telegraf');
const { getStartMenu } = require('./keyboards/main.js');
const db = require('./db');
const userRoutes = require('./routes/user-routes');
const contactDataWizard = require('./scene/registrationScene');
const viewSeatWizard = require('./scene/viewSeat');
const { SCENES } = require('./constants/config');
const createSeat = require('./scene/createSeatScene');
const SeatController = require('./db/controllers/seat-controller');
const createBooking = require('./scene/createBookingScene');
const { TOKEN, PORT } = require('./config');

const app = express();
app.use(express.json());
app.use(userRoutes);

const stage = new Scenes.Stage([
  contactDataWizard,
  viewSeatWizard,
  createSeat,
  createBooking,
]);

const bot = new Telegraf(TOKEN);
bot.use(session());
bot.use(stage.middleware());

bot.start(ctx => {
  ctx.reply('Привет! Давай бронировать', getStartMenu());
});
// Вынести в константы название сцен
bot.hears('Зарегистрироваться', Scenes.Stage.enter(SCENES.REGISTRATION));
bot.hears('Забронировать место', Scenes.Stage.enter(SCENES.BOOKING));
bot.hears('Посмотреть места', Scenes.Stage.enter(SCENES.VIEW_BOOKING));
bot.hears('Добавить место', Scenes.Stage.enter(SCENES.CREATE_SEAT));
bot.hears('Информация о местах', async ctx => {
  const seats = await SeatController.seatGetList();
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

// Можно обрабатывать обычный текст
bot.on('text', () => {});

bot.launch();
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => console.log(`My server is running on port ${PORT}`));
