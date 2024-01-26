import UserSchema from '../models/user';
import { ADMIN_IDS } from '../../constants/config';

export const userCreate = function (
  tgLogin: string,
  fio: string,
  permanentBooking?: any,
) {
  const user = new UserSchema({
    tgLogin: tgLogin,
    fio: fio,
    permanentBooking: permanentBooking ?? undefined,
  });

  return user.save();
};

export const userGetList = function (exists?: boolean) {
  const filter = {};
  if (exists !== undefined) {
    filter['permanentBooking'] = {
      $exists: exists,
    };
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

export const userEditSeat = function (username: string, seat: string | null) {
  return UserSchema.updateOne(
    {
      tgLogin: username,
    },
    { $set: { permanentBooking: seat } },
  ).exec();
};

export const userIsAdmin = function (telegramLogin: string) {
  // @ts-ignore
  return ADMIN_IDS.includes(telegramLogin);
};

export const userDelete = async function () {};
export const userEdit = async function () {};
