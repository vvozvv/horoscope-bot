import express from 'express';
import { Telegraf, session } from 'telegraf';
import 'dotenv/config';
import axios from 'axios';
import { GigaChat } from 'gigachat-node';
import cron  from 'node-cron'
import path from 'path'
import dayjs from 'dayjs';

process.env.NODE_EXTRA_CA_CERTS= path.resolve(__dirname, 'dir', 'with', 'certs')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const app = express();
app.use(express.json());

const client = new GigaChat(
  'ODU1MjYyODEtZDI3Ni00YjI1LWE2MmMtYWEyMmMxZGU3NDBlOjBmNTU4Y2U0LTc4MjItNGNiYS04MjMyLWIyMWFkMmZmODFiNw==',
  true,
  true,
  true
);

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

const additionalTheme = ['любви', 'финансов', 'работы', 'удачи', 'счастья', 'успеха', 'денег']
const additionalType = ['молодежном', 'строгом', 'игривом', 'счастливом', 'грустном']


const bot = new Telegraf(process.env.TOKEN ?? '');
bot.use(session());

const sendMessage = async () => {
  const date = new Date();
  const options = { day: 'numeric', month: 'long' };
  const formattedDate = date.toLocaleDateString('ru-RU', options as any);

  await client.createToken();
  const response = await client.completion({
    "model":"GigaChat:latest",
    "temperature": 2,
    "messages": [
      {
        role:"user",
        content: `
          Напиши краткий гороскоп на одно предложение про совместимость Овна девушки и Козерога парня
          в ${additionalType[randomNumber(1, additionalType.length + 1)]} стиле с использованием темы ${additionalTheme[randomNumber(1, additionalTheme.length + 1)]}
        `,
      }
    ]
  });

  await axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: '@polinahoro',
    text: `${formattedDate}\n\n${response.choices[0].message?.content}`
  })

  return `${formattedDate}\n\n${response.choices[0].message?.content}`
}

const sendQuote = async () => {
  await client.createToken();
  const response = await client.completion({
    "model":"GigaChat:latest",
    "temperature": 2,
    "messages": [
      {
        role:"user",
        content: `Приведи одну цитату на тему ${additionalType[randomNumber(1, additionalType.length + 1)]} одного из этих авторов -
          Федор Достоевский, АЛЬБЕРТ ЭЙНШТЕЙН, ОСКАР УАЙЛЬД, ДЖОРДЖ БЕРНАРД ШОУ, ГАБРИЕЛЬ (КОКО) ШАНЕЛЬ,
          МАРК ТВЕН, Виктор Мари Гюго, Фридрих Ницше, Лев Толстой, Эрих Мария Ремарк
        `,
      }
    ]
  });

  await axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: '@polinahoro',
    text: `#ЭтоЗнак\n\n${response.choices[0].message?.content}`
  })

  return `#ЭтоЗнак\n\n${response.choices[0].message?.content}`
}

const sendDate = async () => {
  const date = getRemainingTime(new Date(), '2024-04-12 06:00');
  await axios.post(`https://api.telegram.org/bot${process.env.TOKEN}/sendMessage`, {
    chat_id: '@polinahoro',
    text: `${date}`
  })

  return date;
}

function declOfNum(n, text_forms) {
  n = Math.abs(n) % 100;
  var n1 = n % 10;
  if (n > 10 && n < 20) { return text_forms[2]; }
  if (n1 > 1 && n1 < 5) { return text_forms[1]; }
  if (n1 == 1) { return text_forms[0]; }
  return text_forms[2];
}

function getRemainingTime(currentDate, endDate) {
  const diff = dayjs(endDate).diff(dayjs(currentDate));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `Осталось ${days} ${declOfNum(days, ['день', 'дня', 'дней'])} и ${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])}`;
}


// Запуск задачи по расписанию
cron.schedule('00 00 10 * * *', async () => {
  await sendMessage();
});

// Запуск задачи по расписанию
cron.schedule('00 00 18 * * *', async () => {
  await sendQuote();
});

// Запуск задачи по расписанию
cron.schedule('00 45 21 * * *', async () => {
  await sendDate();
});


bot.start(async (ctx) => {
  ctx.reply('Тебе сюда нельзя')
});

bot.hears('/post', async (ctx) => {
  const result = await sendMessage();
  ctx.reply(result)
});

bot.hears('/date', async (ctx) => {
  const result = await sendDate();
  ctx.reply(result)
});

bot.hears('/quote', async (ctx) => {
  const result = await sendQuote();
  ctx.reply(result)
});

bot.launch().then(() => console.log('bot launch'));

app.listen(process.env.PORT, () => console.log(`My server is running on port ${process.env.PORT}`));
