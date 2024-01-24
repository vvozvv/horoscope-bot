import { Markup } from 'telegraf';
import { getWorkingDays, getNextWorkWeekDates } from '../helpers/date';
import { splitArray } from '../helpers/array';

export const getMainMenu = function (isAdmin = false) {
  return Markup.keyboard([
    ['Посмотреть места', 'Забронировать место'],
    ['Информация о местах'].concat(isAdmin ? ['Добавить место'] : []),
  ]).resize();
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
