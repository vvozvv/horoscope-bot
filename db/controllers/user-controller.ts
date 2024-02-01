import UserSchema from '../models/user';
import { ADMIN_IDS } from '../../constants/config';

export const userCreate = function (
  tgLogin: string,
  fio: string,
  chatId: string,
  permanentBooking?: any,
) {
  const user = new UserSchema({
    tgLogin: tgLogin,
    fio: fio,
    chatId,
    permanentBooking: permanentBooking ?? undefined,
  });

  return user.save();
};

export const userGetList = function (exists?: boolean, confirmed?: boolean) {
  const filter = {};
  if (exists !== undefined) {
    filter['permanentBooking'] = {
      $exists: exists,
    };
  }

  if (confirmed !== undefined) {
    filter['confirmed'] = confirmed;
  }

  return UserSchema.find(filter).populate({ path: 'permanentBooking' }).exec();
};

export const userGetById = function (id: string | number) {
  return UserSchema.findById(id);
};

export const userGetByTgLogin = function (username: string) {
  return UserSchema.findOne({
    tgLogin: username,
  }).exec();
};

export const userEditSeat = function (
  username: string,
  seat: string | undefined,
  confirmed?: boolean | undefined,
) {
  const updateObject = {};
  if (seat !== undefined) {
    updateObject['seat'] = seat;
  }

  if (confirmed !== undefined) {
    updateObject['confirmed'] = confirmed;
  }

  return UserSchema.updateOne(
    {
      tgLogin: username,
    },
    updateObject,
  ).exec();
};

export const userIsAdmin = function (telegramLogin: string) {
  // @ts-ignore
  return ADMIN_IDS.includes(telegramLogin);
};

export const userDelete = async function () {};
export const userEdit = async function () {};
