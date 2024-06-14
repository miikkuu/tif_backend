const express = require('express');
const {
  createCommunity,  getAllCommunities, getCommunityMembers, getOwnedCommunities,getJoinedCommunities
} = require('../controllers/communityController');
const authMiddleware = require('../middleware/authMiddleware');
const { schemas, validate } = require('../middleware/validators');
const router = express.Router();

router.post('/', authMiddleware, validate(schemas.communitySchemas.create), createCommunity);
router.get('/', authMiddleware, getAllCommunities);
router.get('/:_id/members', authMiddleware, getCommunityMembers);
router.get('/me/owner', authMiddleware, getOwnedCommunities);
router.get('/me/member', authMiddleware, getJoinedCommunities);

module.exports = router;
