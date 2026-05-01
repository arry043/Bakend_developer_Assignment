/**
 * Parse and sanitize pagination parameters from query string
 * @param {object} query - Express req.query
 * @returns {{ skip: number, take: number, page: number, limit: number, orderBy: object }}
 */
const parsePagination = (query) => {
  let page = parseInt(query.page, 10);
  let limit = parseInt(query.limit, 10);

  // Sanitize page
  if (isNaN(page) || page < 1) {
    page = 1;
  }

  // Sanitize limit
  if (isNaN(limit) || limit < 1) {
    limit = 10;
  }
  if (limit > 100) {
    limit = 100;
  }

  // Sort options
  const validSortFields = ['createdAt', 'updatedAt', 'title', 'dueDate', 'priority', 'status'];
  const sortBy = validSortFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const order = query.order === 'asc' ? 'asc' : 'desc';

  const skip = (page - 1) * limit;
  const take = limit;
  const orderBy = { [sortBy]: order };

  return { skip, take, page, limit, orderBy, sortBy, order };
};

module.exports = { parsePagination };
