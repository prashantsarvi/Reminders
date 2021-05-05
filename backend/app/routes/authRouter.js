const express = require('express');
const router  = express.Router();
const { signin, signout, signup } = require('../controllers/users');

router.post('/login', signin);
router.get('/logout', signout);
router.post('/signup', signup);

module.exports = router;