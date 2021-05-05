const express = require('express');
const router  = express.Router();
const { addNotes, getNotesByUser, updateNotes, deleteNotes } = require('../controllers/notes');

router.post('/', addNotes);
router.get('/', getNotesByUser);
router.patch('/', updateNotes);
router.delete('/:noteId', deleteNotes);

module.exports = router;