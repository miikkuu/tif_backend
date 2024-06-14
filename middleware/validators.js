const Joi = require('joi');

const schemas = {
  userSchemas: {
    signUp: Joi.object({
      name: Joi.string().max(64).allow(null),
      email: Joi.string().email().max(128).required(),
      password: Joi.string().max(64).required(),
      created_at: Joi.date().default(Date.now)
    }),
    signIn: Joi.object({
      email: Joi.string().email().max(128).required(),
      password: Joi.string().required()
    })
  },
  communitySchemas: {
    create: Joi.object({
      name: Joi.string().max(128).required(),
      created_at: Joi.date().default(Date.now),
      updated_at: Joi.date().default(Date.now)
    })
  },
  roleSchemas: {
    create: Joi.object({
      name: Joi.string().max(64).required(),
      created_at: Joi.date().default(Date.now),
      updated_at: Joi.date().default(Date.now)
    })
  },
  memberSchemas: {
    add: Joi.object({
      community: Joi.string().required(),
      user: Joi.string().required(),
      role: Joi.string().required(),
      created_at: Joi.date().default(Date.now)
    }),
    remove: Joi.object({
      id: Joi.string().min(19).message("ID must be at least 19 characters long")
    })
  }
};

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

module.exports = { schemas, validate };
