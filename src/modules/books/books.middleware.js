const multer = require('multer');
const { BadRequestError } = require('../../shared/utils/ApiError');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true); // accept it 
    } else {
      cb(new BadRequestError('Only JPEG, PNG, and WebP images are allowed'), false);
    }
  },
});

//looks for field named cover in the multipart/form-data
//put that file in req.file + put any other info as strings in req.body (price,stock..etc)
//for storage we used memoryStorage(), so mage bytes are placed inreq.file.buffer (a Buffer in RAM)
const uploadBookCover = upload.single('cover');

const normalizeBookFormBody = (req, res, next) => {
  const body = req.body;
  if (typeof body.categories === 'string') {
    try {
      // this will work '["id1","id2"]' → ["id1", "id2"]
      body.categories = JSON.parse(body.categories);
    } catch {
      // "id1, id2, id3"
      body.categories = body.categories.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }
  if (body.price !== undefined) body.price = Number(body.price);
  if (body.stock !== undefined) body.stock = Number(body.stock) || 0;
  next();
};

module.exports = {
  uploadBookCover,
  normalizeBookFormBody,
};
