const User = require('../../database/models/user.model');
const { UnauthorizedError } = require('../../shared/utils/ApiError');

const getUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new UnauthorizedError("user doesn't exist");
  return user;
};

const updateUser = async (email, updates) => {
  const user = await User.findOneAndUpdate({email}, updates, {
    returnDocument: 'after', runValidators: true
  });
  return user;
};

module.exports = {
  getUser,
  updateUser
};