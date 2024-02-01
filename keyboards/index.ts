import { Markup } from 'telegraf';
import { getNextWorkWeekDates, getWorkingDays } from '../helpers/date';
import { splitArray } from '../helpers/array';

export const getMainMenu = function (isAdmin = false) {
  const baseMenuButton = [
    ['Посмотреть места', 'Забронировать место'],
    ['Информация о местах', 'Информация о пользователях'],
    ['Посмотреть мою бронь', 'Удалить бронь'],
  ];

  if (isAdmin) {
    baseMenuButton.push(['Добавить место', 'Редактирование пользователя']);
    baseMenuButton.push(['Заявки в бота']);
  }

  return Markup.keyboard(baseMenuButton).resize();
};

export const getDatesMenu = function () {
  let currentWeekDates = getWorkingDays(new Date());

  if (currentWeekDates.length <= 2) {
    currentWeekDates = [
      ...currentWeekDates,
      ...getNextWorkWeekDates(new Date()),
      '↩ Назад',
    ];
  }

  return Markup.keyboard(splitArray(currentWeekDates)).resize();
};

export const getStartMenu = function () {
  return Markup.keyboard(['Зарегистрироваться']).resize();
};

export const getYesNoMenu = function () {
  return Markup.keyboard(['Да', 'Нет']).resize();
};
