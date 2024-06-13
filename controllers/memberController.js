const Member = require("../models/Member");
const Community = require("../models/Community");
const Role = require("../models/Role");
const { Snowflake } = require("@theinternetfolks/snowflake");

const addMember = async (req, res) => {
  try {
    const { community, user, role } = req.body;
    const requestingUserRole = await Member.findOne({
      community,
      user: req.user._id,
    }).populate("role");

    if (requestingUserRole.role.name !== "Community Admin") {
      return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" });
    }

    const member = new Member({
      _id: Snowflake.generate(),
      community,
      user,
      role,
      created_at: new Date(),
    });
    await member.save();
    res.status(200).json({
      status: true,
      content: {
        data: {
          id: member._id,
          community: member.community,
          user: member.user,
          role: member.role,
          created_at: member.created_at,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeMember = async (req, res) => {
  try {
    const { _id } = req.params;
    const member = await Member.findById(_id);
    console.log(member);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }
    const requestingUserRole = await Member.findOne({
      community: member.community,
      user: req.user._id,
    }).populate("role");

    if (
      ["Community Admin", "Community Moderator"].includes(
        requestingUserRole.role.name
      )
    ) {
      await Member.deleteOne({ _id: member._id });

      res
        .status(200)
        .json({ status: true, message: "Member removed successfully" });
    } else {
      return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" });
    }
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addMember, removeMember };
