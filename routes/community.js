const express = require('express');
const {
  createCommunity,
  getAllCommunities,
  getCommunityMembers,
  getOwnedCommunities,
  getJoinedCommunities
} = require('../controllers/communityController.js');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createCommunity);
router.get('/', authMiddleware, getAllCommunities);
router.get('/:_id/members', authMiddleware, getCommunityMembers);
router.get('/me/owner', authMiddleware, getOwnedCommunities);
router.get('/me/member', authMiddleware, getJoinedCommunities);

module.exports = router;
