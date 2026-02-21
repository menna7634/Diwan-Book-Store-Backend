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
  }
});


const UserAuthModel = mongoose.model("UserAuths", authSchema);

module.exports = UserAuthModel;