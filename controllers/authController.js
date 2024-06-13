const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Snowflake } = require('@theinternetfolks/snowflake');

const signUp = async (req, res) => {
  try {
    

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      _id:  Snowflake.generate(),
      name,
      email,
      password: hashedPassword
    });
   

    
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          meta: {
            access_token: token,
          },
        },
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.status(200).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          meta: {
            access_token: token,
          },
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({_id: req.user._id}).select('-password');
      res.status(200).json({
        status: true,
        content: {
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
        },
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { signUp, signIn, getMe };
