const Community = require("../models/Community");
const Member = require("../models/Member");
const Role = require("../models/Role");
const { Snowflake } = require("@theinternetfolks/snowflake");
const slugify = require("slugify");

const createCommunity = async (req, res) => {
  try {
    const { name } = req.body; // Trust validation middleware

    const slug = slugify(name, { lower: true });

    const existingCommunity = await Community.findOne({ slug });
    if (existingCommunity) {
      return res
        .status(400)
        .json({ error: "A community with this name already exists" });
    }

    const community = new Community({
      _id: Snowflake.generate(),
      name,
      slug,
      owner: req.user._id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    await community.save();

    let adminRole = await Role.findOne({ name: "Community Admin" });
    if (!adminRole) {
      adminRole = await Role.create({
        _id: Snowflake.generate(),
        name: "Community Admin",
      });
    }

    const member = new Member({
      _id: Snowflake.generate(),
      community: community._id,
      user: req.user._id,
      role: adminRole._id,
      created_at: new Date(),
    });
    await member.save();

    res.status(201).json({
      status: true,
      content: {
        data: {
          id: community._id,
          name: community.name,
          slug: community.slug,
          owner: community.owner,
          created_at: community.created_at,
          updated_at: community.updated_at,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" }); 
  }
};
const getAllCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 

    const communities = await Community.find()
      .populate("owner", "_id name")
      .limit(limit) 
      .skip((page - 1) * limit) 
      .exec();

    const count = await Community.countDocuments();
    const transformedCommunities = communities.map((community) => ({
      id: community._id,
      name: community.name,
      slug: community.slug,
      owner: {
        id: community.owner._id,
        name: community.owner.name,
      },
      created_at: community.created_at,
      updated_at: community.updated_at,
    }));

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: parseInt(page),
        },
        data: transformedCommunities,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }); // Consider more specific errors
  }
};

const getCommunityMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { _id } = req.params; // _id here is actually the community name

    const community = await Community.findOne({ slug: _id });
    if (!community) {
      return res.status(404).json({ error: "Community not found" });
    }

    const members = await Member.find({ community: community._id })
      .select("-__v")
      .populate("user", "_id name")
      .populate("role", "_id name")
      .limit(limit) 
      .skip((page - 1) * limit) 
      .exec();

    const count = await Member.countDocuments({ community: community._id });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
        },
        data: members,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" }); 
  }
};

const getOwnedCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const communities = await Community.find({ owner: req.user._id })
      .select("-__v")
      .limit(limit) 
      .skip((page - 1) * limit) 
      .exec();

    const count = await Community.countDocuments({ owner: req.user._id });

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: parseInt(page),
        },
        data: communities,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const getJoinedCommunities = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 

    const members = await Member.find({ user: req.user._id })
      .select("-__v")
      .populate("community") // Populate community details
      .limit(limit) 
      .skip((page - 1) * limit) 
      .exec();

    const count = await Member.countDocuments({ user: req.user._id });
    const communities = members.map((member) => member.community); // Extract communities

    res.status(200).json({
      status: true,
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / limit),
          page: parseInt(page),
        },
        data: communities,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityMembers,
  getOwnedCommunities,
  getJoinedCommunities,
};
