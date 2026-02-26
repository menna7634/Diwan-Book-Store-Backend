const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "users",
    required: true,
  },
  refresh_token: {
    type: String,
  },
  is_verified: {
    type: Boolean,
    required: true,
  },
  verification_token: {
    type: String
  }
});


const UserAuthModel = mongoose.model("UserAuths", authSchema);

module.exports = UserAuthModel;