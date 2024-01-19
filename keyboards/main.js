const { Markup } = require('telegraf');
const { getWorkingDays, getNextWorkWeekDates } = require('../helpers/date');
const { splitArray } = require('../helpers/array');

exports.getMainMenu = function (isAdmin = false) {
  return Markup.keyboard([
    ['Посмотреть места', 'Забронировать место'],
    ['Информация о местах'].concat(isAdmin ? ['Добавить место'] : []),
  ]).resize();
};

exports.getDatesMenu = function () {
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

exports.getStartMenu = function () {
  return Markup.keyboard(['Зарегистрироваться']).resize();
};

exports.getYesNoMenu = function () {
  return Markup.keyboard(['Да', 'Нет']).resize();
};
