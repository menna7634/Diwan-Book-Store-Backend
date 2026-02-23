const { Readable } = require('stream');
const cloudinary = require('cloudinary').v2;
const config = require('../config');

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

const uploadImageFromBuffer = (buffer, folder = 'book-covers') => {
  return new Promise((resolve, reject) => {
    //creates a stream for cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    // take image bytes from memory then stream them then give it to cloudinary stream
    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = {
  cloudinary,
  uploadImageFromBuffer,
};
