const daysOfWeek = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
};

exports.daysOfWeek = daysOfWeek;

exports.getNextWorkWeekDates = function (date) {
  const daysInWeek = 7;
  const currentDate = new Date(date.getTime());

  // Находим следующий рабочий понедельник
  while (currentDate.getDay() !== 1) {
    // 1 - понедельник
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const nextWorkWeekDates = []; // Массив для хранения дат следующей рабочей недели

  // Добавляем даты следующей рабочей недели в массив
  for (let i = 0; i < daysInWeek; i++) {
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;

    nextWorkWeekDates.push(
      `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month} ${daysOfWeek[currentDate.getDay()]}`,
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return nextWorkWeekDates.splice(0, 5);
};

exports.getWorkingDays = function (currDate) {
  const currDayOfWeek = currDate.getDay();
  const dates = [];

  dates.push(`${currDate.getDate()}.${currDate.getMonth() + 1}`);

  for (let i = 1; i <= 5 - currDayOfWeek; i++) {
    const nextDate = new Date(currDate.getTime() + i * 24 * 60 * 60 * 1000);

    if (nextDate.getDay() !== 0 && nextDate.getDay() !== 6) {
      const day = nextDate.getDate();
      const month = nextDate.getMonth() + 1;
      dates.push(
        `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month} ${daysOfWeek[nextDate.getDay()]}`,
      );
    }
  }

  return dates;
};

exports.formatDate = function (date, separator = '-') {
  const [day, month] = date.split('.');
  const year = new Date().getFullYear();

  return `${year}${separator}${month}${separator}${day}`;
};

exports.formatPrettyDate = function (date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
}

exports.formatDateToRu = function (dateString) {
  // Разбиваем строку на день и месяц
  const [day, month] = dateString.split('.');

  // Создаем объект Date и устанавливаем год на текущий
  const date = new Date();
  date.setFullYear(new Date().getFullYear());

  // Устанавливаем месяц и день
  date.setMonth(parseInt(month, 10) - 1); // -1, так как в JavaScript месяцы начинаются с 0
  date.setDate(parseInt(day, 10));

  // Определяем месяц на русском языке
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  // Формируем строку в требуемом формате
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

exports.parseDate = function (dateString) {
  let parts = dateString.split('.');
  let day = parseInt(parts[0]);
  let month = parseInt(parts[1]);
  let currentDate = new Date();
  let year = currentDate.getFullYear();

  return new Date(year, month - 1, day, 12, 0);
};

/**
 * Возвращает дату на 2 неделе старше от текущей
 */
exports.getDateInTwoWeeks = function () {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
}
