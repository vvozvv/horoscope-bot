const express = require('express');
const router = express.Router();
const UserController = require('../db/controllers/user-controller');

/**
 * @route POST api/user
 * @access  Public
 */
router.post('/user', async (req, res) => {
  if (!req.body.tgLogin || !req.body.fio) {
    res.status(400).send({
      message: 'required fields cannot be empty',
    });
  }
  
  const user = await UserController.userCreate(req.body.tgLogin, req.body.fio);
  
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(500).send('error');
  }
});

router.get('/user', async (req, res) => {
  const user = await UserController.userGetList();
  
  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(500).send('error');
  }
});

module.exports = router;
