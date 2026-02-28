const withTransaction = async (fn) => {
  return await fn(null);
};

module.exports = { withTransaction };
