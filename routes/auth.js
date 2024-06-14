const express = require('express');
const { signUp, signIn, getMe } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { schemas, validate } = require('../middleware/validators');
const router = express.Router();

router.post('/signup', validate(schemas.userSchemas.signUp), signUp);
router.post('/signin', validate(schemas.userSchemas.signIn), signIn);
router.get('/me', authMiddleware, getMe);

module.exports = router;
