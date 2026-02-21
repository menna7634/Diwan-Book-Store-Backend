const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../../shared/config');
const UserAuth = require('../../database/models/user_auth.model');
const User = require('../../database/models/user.model');
const { UnauthorizedError, BadRequestError } = require('../../shared/utils/ApiError');

const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email }).select('+password');
  if (!user) throw new UnauthorizedError("Email or Password are wrong");
  console.log(user);
  // check password
  const result = await bcrypt.compare(password, user.password);
  if (!result) throw new UnauthorizedError("Email or Password are wrong");

  // create access_token and refresh_tokens
  const jwtPayLoad = {
    email: user.email,
    role: user.role
  };
  const accessToken = jwt.sign(jwtPayLoad, config.jwt.secret, {
    expiresIn: config.jwt.accessExpirationMinutes + 'm'
  });

  // create a refresh token and save it to database
  const refreshToken = jwt.sign(jwtPayLoad, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpirationDays + 'd'
  });
  await UserAuth.findOneAndUpdate({ user: user._id }, { refresh_token: refreshToken });

  return {
    access_token: accessToken,
    refresh_token: refreshToken
  };

};

const register = async (userData) => {
  //make a transaction
  const session = await mongoose.startSession();

  const user = await session.withTransaction(async () => {
    // check if the email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new BadRequestError("Email already used");

    // create the user

    const [newUser] = await User.create([userData], { session });

    // create user auth for the new user
    await UserAuth.create([{
      user: newUser.id,
      is_verified: false,
    }], { session });
    // just that
    return newUser;
  });

  return user;
};

module.exports = {
  login,
  register,
};