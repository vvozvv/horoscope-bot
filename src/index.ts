import express from 'express';
import { Telegraf, session } from 'telegraf';
import 'dotenv/config';
import axios from 'axios';
import { GigaChat } from 'gigachat-node';
import cron  from 'node-cron'
import path from 'path'

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


// Запуск задачи по расписанию
cron.schedule('00 00 10 * * *', async () => {
  await sendMessage();
});


bot.start(async (ctx) => {
  ctx.reply('Тебе сюда нельзя')
});

bot.hears('/post', async (ctx) => {
  const result = await sendMessage();
  ctx.reply(result)
});

bot.launch().then(() => console.log('bot launch'));

app.listen(process.env.PORT, () => console.log(`My server is running on port ${process.env.PORT}`));
