const express = require('express');
const { addMember, removeMember } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, addMember);
router.delete('/:_id', authMiddleware, removeMember);

module.exports = router;
