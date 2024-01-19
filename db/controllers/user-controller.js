const userSchema = require('../models/user');
const { ADMIN_IDS } = require('../../constants/config');

exports.userCreate = function (tgLogin, fio, permanentBooking) {
  const user = new userSchema({
    tgLogin: tgLogin,
    fio: fio,
    permanentBooking: permanentBooking ?? undefined,
  });

  return user.save();
};

exports.userGetList = function () {
  return userSchema.find();
};

exports.userGetById = function (id) {
  return userSchema.findById(id);
};

exports.userGetByTgLogin = function (username) {
  return userSchema.findOne({
    tgLogin: username,
  });
};

exports.userIsAdmin = async function (telegramLogin) {
  return ADMIN_IDS.includes(telegramLogin);
};

exports.userDelete = async function () {};
exports.userEdit = async function () {};
