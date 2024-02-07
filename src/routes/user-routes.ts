import { Router } from 'express';
import { userCreate, userGetList } from '../db/controllers/user-controller'

const router = Router();

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

  const user = await userCreate(req.body.tgLogin, req.body.fio, req.body.chatId);

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(500).send('error');
  }
});

router.get('/user', async (req, res) => {
  const user = await userGetList();

  if (user) {
    return res.status(200).send(user);
  } else {
    return res.status(500).send('error');
  }
});

export default router;
