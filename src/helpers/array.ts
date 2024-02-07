/**
 * Разбитие большого массива на маленькие, чтобы отображалось по 3 кнопки в телеграме
 */
export const splitArray = function (array: string[], size = 3) {
  const subArrays: string[][] = [];
  for (let i = 0; i < array.length; i += size) {
    subArrays.push(array.slice(i, i + size));
  }
  return subArrays;
};

export const excludeArr = function (arr1, arr2) {
  return arr1.filter(item => !arr2.includes(item));
};
