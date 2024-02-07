export const daysOfWeek = {
  0: 'Воскресенье',
  1: 'Понедельник',
  2: 'Вторник',
  3: 'Среда',
  4: 'Четверг',
  5: 'Пятница',
  6: 'Суббота',
};

export const getNextWorkWeekDates = function (date) {
  const daysInWeek = 7;
  const currentDate = new Date(date.getTime());

  // Находим следующий рабочий понедельник
  while (currentDate.getDay() !== 1) {
    // 1 - понедельник
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const nextWorkWeekDates: string[] = []; // Массив для хранения дат следующей рабочей недели

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

export const getWorkingDays = function (currDate): string[] {
  const currDayOfWeek = currDate.getDay();
  const dates: string[] = [];

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

export const formatDate = function (date, separator = '-') {
  const [day, month] = date.split('.');
  const year = new Date().getFullYear();

  return `${year}${separator}${month}${separator}${day}`;
};

export const formatPrettyDate = function (date) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('ru-RU', options);
}

export const formatDateToRu = function (dateString) {
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

export const parseDate = function (dateString) {
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
export const getDateInTwoWeeks = function () {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + (14 * 24 * 60 * 60 * 1000));
}


/**
 * Возвращает дату из строки типа: 1 февраля 2024 г.
 */
export const getDateFromTheString = function (dateString) {
  // todo: переделать
  const months = {
    "января": 0,
    "февраля": 1,
    "марта": 2,
    "апреля": 3,
    "мая": 4,
    "июня": 5,
    "июля": 6,
    "августа": 7,
    "сентября": 8,
    "октября": 9,
    "ноября": 10,
    "декабря": 11
  };

  const parts = dateString.split(' ');
  const day = parseInt(parts[0]);
  const month = months[parts[1]];
  const year = parseInt(parts[2]);

  return new Date(year, month, day, 12, 0o0);
}
