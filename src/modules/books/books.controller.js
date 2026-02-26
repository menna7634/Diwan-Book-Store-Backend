const mongoose = require('mongoose');
const Book = require('../../database/models/book.model');
const Author = require('../../database/models/author.model');
const Category = require('../../database/models/category.model');
const { BadRequestError, NotFoundError } = require('../../shared/utils/ApiError');
const { uploadImageFromBuffer } = require('../../shared/utils/cloudinary');
const { paginate } = require('../../shared/utils/pagination');

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;

const parseCsvToObjectIds = (str, fieldName) => {
  if (!str || typeof str !== 'string') return [];
  const ids = str.split(',').map((s) => s.trim()).filter(Boolean);
  const valid = [];
  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError(`Invalid ${fieldName}`);
    }
    valid.push(new mongoose.Types.ObjectId(id));
  }
  return valid;
};

const parseNumber = (val, min, max, defaultValue) => {
  const num = Number(val);
  if (Number.isNaN(num) || val === '' || val === null || val === undefined) return defaultValue;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
};

const listBooks = async (req, res, next) => {
  try {
    const {
      authorIds: authorIdsRaw,
      categoryIds: categoryIdsRaw,
      categoryMode,
      minPrice: minPriceRaw,
      maxPrice: maxPriceRaw,
      search,
      sort: sortParam,
      order,
      page: pageRaw,
      limit: limitRaw,
    } = req.query;

    const page = parseNumber(pageRaw, 1, undefined, DEFAULT_PAGE);
    const limit = Math.min(parseNumber(limitRaw, 1, MAX_LIMIT, DEFAULT_LIMIT), MAX_LIMIT);

    const authorIds = parseCsvToObjectIds(authorIdsRaw, 'author ID');
    const categoryIds = parseCsvToObjectIds(categoryIdsRaw, 'category ID');
    //if minprice or maxprice is missing we pass undefined so we dont filter byt it
    const minPrice = parseNumber(minPriceRaw, 0, 999999.99, undefined);
    const maxPrice = parseNumber(maxPriceRaw, 0, 999999.99, undefined);


    // start building based on what user asked for
    const filter = {};


    if (authorIds.length > 0) {
      filter.author_id = { $in: authorIds };
    }
    if (categoryIds.length > 0) {
      filter.categories = categoryMode === 'all' ? { $all: categoryIds } : { $in: categoryIds };
    }
    if (minPrice !== undefined && !Number.isNaN(minPrice)) {
      //If filter.price already exists, keep it (used if we want to use both min and max so we dont create it twice)
      filter.price = filter.price || {};
      filter.price.$gte = minPrice;
    }
    if (maxPrice !== undefined && !Number.isNaN(maxPrice)) {
      filter.price = filter.price || {};
      filter.price.$lte = maxPrice;
    }

    //If the user provides ?search=something
    const useSearch = search && typeof search === 'string' && search.trim().length > 0;
    if (useSearch) {
      filter.$text = { $search: search.trim() };
    }

   
    //lean: true means: return plain JS objects, not full Mongoose documents. Faster + less memory
    const paginateOptions = { page, limit, lean: true };
    if (useSearch) {
      //add a field named score to each returned book, and fill it with Mongo’s textScore value.
      paginateOptions.projection = { score: { $meta: 'textScore' } };
      //sort by relevance, then by newest
      paginateOptions.sort = { score: { $meta: 'textScore' }, createdAt: -1 };
    } else {
      const sortField = sortParam === 'price' ? 'price' : 'createdAt';
      const sortOrder = order === 'asc' ? 1 : -1;
      paginateOptions.sort = sortOrder === -1 ? `-${sortField}` : sortField;
    }

    const result = await paginate(Book, filter, paginateOptions);
    res.json(result);
  } catch (err) {
    next(err);
  }
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

const getBookById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id).lean();
    if (!book) throw new NotFoundError('Book not found');
    res.json(book);
  } catch (err) {
    next(err);
  }
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
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
