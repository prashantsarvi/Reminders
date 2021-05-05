const express = require('express');
const router  = express.Router();
const { addReminders, getRemindersByUser, updateReminders, deleteReminders } = require('../controllers/reminders');

router.post('/', addReminders);
router.get('/', getRemindersByUser);
router.patch('/', updateReminders);
router.delete('/:reminderId', deleteReminders);

module.exports = router;