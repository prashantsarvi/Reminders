const express = require('express');
const router  = express.Router();
const notesRouter = require('./notesRouter');
const remindersRouter = require('./reminderRouter');
const userRouter = require('./userRouter');


router.use('/user', userRouter);
router.use('/notes', notesRouter);
router.use('/reminders', remindersRouter);


module.exports = router;