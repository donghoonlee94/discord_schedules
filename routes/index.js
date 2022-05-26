let express = require('express');
let router = express.Router();
const userSchema = require('../schema/user');

router.post('/user', (req, res, next) => {
  const { name, schedule } = req.body;
  let user = new userSchema();
  user.name = name;
  user.schedule = schedule;

  user
    .save()
    .then((result) => {
      console.log(result);
      res.json({ msg: 'success' });
    })
    .catch((err) => {
      console.log(err);
      res.json({ msg: 'error' });
    });
});

router.get('/user', (req, res, next) => {
  userSchema
    .find({}, { _id: 0, __v: 0 })
    .then((result) => {
      res.json({
        message: 'success',
        data: result,
      });
    })
    .catch((error) => {
      res.json({
        message: 'error',
      });
    });
});

module.exports = router;
