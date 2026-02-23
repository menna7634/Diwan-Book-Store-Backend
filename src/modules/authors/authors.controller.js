const Author = require('../../database/models/author.model');
const { BadRequestError, NotFoundError } = require('../../shared/utils/ApiError');
const { paginate } = require('../../shared/utils/pagination');

const listAuthors = async (req, res, next) => {
  try {
    const { page: pageRaw, limit: limitRaw } = req.query;

    const page = Number(pageRaw) || 1;
    const limit = Number(limitRaw) || 10;

    const result = await paginate(Author, {}, {
      page,
      limit,
      sort: 'name',
      lean: true,
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
};

const createAuthor = async ({ name, bio }) => {
  const existingAuthor = await Author.findOne({ name });
  if (existingAuthor) throw new BadRequestError('Author with this name already exists');

  const author = await Author.create({ name, bio: bio || '' });
  return author;
};

const updateAuthor = async (id, body) => {
  const author = await Author.findById(id);
  if (!author) throw new NotFoundError('Author not found');

  if (body.name && body.name !== author.name) {
    const existingAuthor = await Author.findOne({ name: body.name });
    if (existingAuthor) throw new BadRequestError('Author with this name already exists');
  }

  const updatedAuthor = await Author.findByIdAndUpdate(
    id,
    { $set: body },
    { returnDocument: 'after', runValidators: true }
  );
  return updatedAuthor;
};

module.exports = {
  listAuthors,
  createAuthor,
  updateAuthor,
};
