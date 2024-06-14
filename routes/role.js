const express = require('express');
const { createRole, getAllRoles } = require('../controllers/roleController');
const authMiddleware = require('../middleware/authMiddleware');
const { schemas, validate } = require('../middleware/validators');
const router = express.Router();

router.post('/', validate(schemas.roleSchemas.create), createRole);
router.get('/', getAllRoles);

module.exports = router;
