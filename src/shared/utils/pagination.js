// paginate for db pagination but paginate array for memory pagination
const paginate = async (Model, filter = {}, options = {}) => {
  let page = parseInt(options.page);
  let limit = parseInt(options.limit);
  // i want to make some validations like validate page and limit range
  page = page > 0 ? page : 1;
  limit = limit > 0 ? limit : 10;

  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  const total = await Model.countDocuments(filter);

  const data = await Model.find(filter)
    .sort(options.sort || '-createdAt')
    .skip(skip)
    .limit(limit)
    .populate(options.populate || '')
    .select(options.select || '');

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

const paginateArray = (arr = [], options = {}) => {
  let page = parseInt(options.page);
  let limit = parseInt(options.limit);

  page = page > 0 ? page : 1;
  limit = limit > 0 ? limit : 10;

  if (limit > 50) limit = 50;

  const start = (page - 1) * limit;

  return {
    data: arr.slice(start, start + limit),
    pagination: {
      total: arr.length,
      page,
      limit,
      totalPages: Math.ceil(arr.length / limit),
      hasNextPage: page * limit < arr.length,
      hasPrevPage: page > 1,
    },
  };
};

module.exports = { paginate, paginateArray };
