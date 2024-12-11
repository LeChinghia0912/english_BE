const { get } = require("lodash");
const User = require("../models/user");

const checkAdminRole = async (req, res, next) => {
  const userId = get(req, ["user", "id"])

  const user = await User.findById(userId);

  const roles = get(user, ["role"]);

  if (roles !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
}

module.exports = checkAdminRole;
