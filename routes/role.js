const express = require('express');
const { addMember, removeMember } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const { createRole, getAllRoles } = require('../controllers/roleController');
const router = express.Router();

router.post('/',  createRole);
router.get('/', getAllRoles);
router.delete('/:_id', authMiddleware, removeMember);

module.exports = router;
