const User = require('../../database/models/user.model');
const { UnauthorizedError } = require('../../shared/utils/ApiError');
const logger = require('../../shared/utils/logger');
const bcrypt = require('bcryptjs');

const getUser = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new UnauthorizedError("user doesn't exist");
  return user;
};

const updateUser = async (email, updates) => {
  // if password was provided
  if (updates.password) {
    const password = updates.password;
    const oldPassword = updates.oldPassword;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      logger.ward({email}, "Unexpectedly email wasn't found");
      throw new UnauthorizedError("user doesn't exist");
    }
    
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("old password is incorrect");
    
    user.password = password;
    await user.save();
  }
  
  delete updates.oldPassword;
  delete updates.password;
  
  const user = await User.findOneAndUpdate({ email }, updates, {
    returnDocument: 'after', runValidators: true
  });
  return user;
};

module.exports = {
  getUser,
  updateUser
};