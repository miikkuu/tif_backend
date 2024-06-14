const express = require('express');
const { addMember, removeMember } = require('../controllers/memberController');
const authMiddleware = require('../middleware/authMiddleware');
const { schemas, validate } = require('../middleware/validators');
const router = express.Router();

router.post('/', authMiddleware, validate(schemas.memberSchemas.add), addMember);
router.delete('/:_id', authMiddleware, validate(schemas.memberSchemas.remove), removeMember);

module.exports = router;
