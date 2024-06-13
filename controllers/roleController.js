const Role = require('../models/Role');
const {Snowflake} = require('@theinternetfolks/snowflake');

const createRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

     const roleCheck = await Role.findOne({ name });
    if (roleCheck) {
      return res.status(409).json({ error: 'Role already exists' });
    }


    const role = new Role({
      _id: Snowflake.generate(),
      name,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    await role.save();

    res.status(201).json({
      status: true,
      content: {
      data: {
        id: role._id,
        name: role.name,
        created_at: role.created_at,
        updated_at: role.updated_at
      }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const roles = await Role.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    const count = await Role.countDocuments();
    res.status(200).json({
      status: true,
      content: {
      meta: {
        total: count,
        pages: Math.ceil(count / limit),
        page: parseInt(page)
      },
      data: roles.map(role => ({
        id: role._id,
        name: role.name,
        created_at: role.created_at,
        updated_at: role.updated_at
      }))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { createRole, getAllRoles };
