const config = require('../config');

const parsePagination = (query) => {
  let page = parseInt(query.page, 10) || config.pagination.defaultPage;
  let limit = parseInt(query.limit, 10) || config.pagination.defaultLimit;

  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  if (limit > config.pagination.maxLimit) limit = config.pagination.maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};
const buildPaginationMeta = (page, limit, totalDocs) => {
  const totalPages = Math.ceil(totalDocs / limit);

  return {
    page,
    limit,
    totalDocs,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { parsePagination, buildPaginationMeta };
