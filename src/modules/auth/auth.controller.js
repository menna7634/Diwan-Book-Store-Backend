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
  // check if email is verified
  const userAuth = await UserAuth.findOne({ user: user._id });
  if (!userAuth.is_verified) throw new UnauthorizedError("Email isn't verified");
  // check password
  const result = await bcrypt.compare(password, user.password);
  if (!result) throw new UnauthorizedError("Email or Password are wrong");

  // create access_token and refresh_tokens
  const jwtPayLoad = {
    id: user._id,
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

  const [user, userAuth] = await session.withTransaction(async () => {
    // check if the email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) throw new BadRequestError("Email already used");

    // create the user

    const [newUser] = await User.create([userData], { session });

    // create user auth for the new user
    const [userAuth] = await UserAuth.create([{
      user: newUser.id,
      is_verified: !config.emailVerification.isEnabled,
    }], { session });
    // just that
    return [newUser, userAuth];
  });

  // generation a verification token

  if (config.emailVerification.isEnabled) {
    const verifcationTokenPayload = {
      id: user.id,
      type: "email_verification"
    };

    const verificationToken = jwt.sign(verifcationTokenPayload, config.jwt.secret,
      { expiresIn: config.emailVerification.tokenExpirationHours+"h", }
    );
    userAuth.verification_token = verificationToken;
    await userAuth.save();
    //send the token via email
    
  }

  return user;
};

const refreshAccessToken = async (refresh_token) => {
  let payload;
  try {
    payload = jwt.verify(refresh_token, config.jwt.secret);
  } catch (e) {
    throw new UnauthorizedError(e.message);
  }
  const userAuth = await UserAuth.findOne({ user: payload.id });
  if (refresh_token !== userAuth.refresh_token) {
    throw new UnauthorizedError({ type: "invalid_token", message: "non matching refresh token" });
  }

  // generate a new access token
  const newPayload = {
    email: payload.email,
    id: payload.id,
    role: payload.role,
  };
  const accessToken = jwt.sign(newPayload, config.jwt.secret, { expiresIn: config.jwt.accessExpirationMinutes + 'm' });
  return accessToken;
};
const logout = async (userId) => {
  const userAuth = await UserAuth.findOne({ user: userId });
  if (!userAuth) throw new UnauthorizedError({ type: "not_found" });
  userAuth.refresh_token = null;
  userAuth.save();
};

const verifyEmail = async (token) => {
  let payload;
  try {
    payload = jwt.verify(token, config.jwt.secret);

  } catch (e) {
    throw new UnauthorizedError({ type: "invalid_token", detail: e });
  }

  const userAuth = await UserAuth.findOne({ user: payload.id });
  if (!userAuth || userAuth.verification_token !== token) {
    throw new UnauthorizedError({ type: "invalid_token" });
  }

  userAuth.is_verified = true;
  userAuth.verification_token = undefined;
  await userAuth.save();
  return userAuth;
};

module.exports = {
  login,
  register,
  refreshAccessToken,
  logout,
  verifyEmail,
};