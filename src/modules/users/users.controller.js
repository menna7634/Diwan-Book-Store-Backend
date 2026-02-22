const User = require('../../database/models/user.model');
const { UnauthorizedError } = require('../../shared/utils/ApiError');

const getUser = async (email) => {
  const user = await User.findOne({email});
  if(!user) throw new UnauthorizedError("user doesn't exist");
  return user;
};

module.exports = {
  getUser,
};