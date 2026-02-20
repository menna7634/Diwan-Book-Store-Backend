const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Author name must be at least 2 characters'],
      maxlength: [200, 'Author name cannot exceed 200 characters'],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [2000, 'Bio cannot exceed 2000 characters'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Author', authorSchema);
