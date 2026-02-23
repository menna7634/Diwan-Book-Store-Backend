const Book = require('../../database/models/book.model');
const Author = require('../../database/models/author.model');
const Category = require('../../database/models/category.model');
const { BadRequestError, NotFoundError } = require('../../shared/utils/ApiError');
const { uploadImageFromBuffer } = require('../../shared/utils/cloudinary');

const listBooks = async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
};

const createBook = async (req, res) => {
  if (req.file) {
    const result = await uploadImageFromBuffer(req.file.buffer);
    //Cloudinary returns result with fields like secure_url, public_id..etc
    req.body.book_cover_url = result.secure_url;
  }

  const body = req.body;
  const author = await Author.findById(body.author_id);
  if (!author) throw new BadRequestError('Author not found');

  const categories = await Category.find({ _id: { $in: body.categories } });
  if (categories.length !== body.categories.length) {
    throw new BadRequestError('One or more categories not found');
  }

  const book = await Book.create({
    author_id: body.author_id,
    categories: body.categories,
    book_title: body.book_title,
    book_cover_url: body.book_cover_url || undefined,
    price: body.price,
    stock: body.stock ?? 0,
  });
  res.status(201).json(book);
};

const updateBook = async (req, res) => {
  if (req.file) {
    const result = await uploadImageFromBuffer(req.file.buffer);
    req.body.book_cover_url = result.secure_url;
  }

  const { id } = req.params;
  const body = req.body;

  const book = await Book.findById(id);
  if (!book) throw new NotFoundError('Book not found');

  if (body.author_id) {
    const author = await Author.findById(body.author_id);
    if (!author) throw new BadRequestError('Author not found');
  }

  if (body.categories && body.categories.length > 0) {
    const categories = await Category.find({ _id: { $in: body.categories } });
    if (categories.length !== body.categories.length) {
      throw new BadRequestError('One or more categories not found');
    }
  }

  const updatedBook = await Book.findByIdAndUpdate(
    id,
    { $set: body },
    { returnDocument: 'after', runValidators: true }
  );
  res.json(updatedBook);
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  const book = await Book.findById(id);
  if (!book) throw new NotFoundError('Book not found');
  await Book.findByIdAndDelete(id);
  res.status(204).send();
};

module.exports = {
  listBooks,
  createBook,
  updateBook,
  deleteBook,
};
