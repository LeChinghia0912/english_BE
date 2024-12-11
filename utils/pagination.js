// utils/pagination.js
const expressPaginate = require("express-paginate");

function paginationMiddleware(limitDefault = 10, limitMax = 50) {
  return expressPaginate.middleware(limitDefault, limitMax);
}

async function paginateItems(query, page, limit, data, searchQuery = "") {
  const skip = (page - 1) * limit;
  let items = [];
  let itemCount = 0;

  if (Array.isArray(data)) {

    itemCount = data.length;
    items = data.slice(skip, skip + limit);
  } else {
    // Nếu `data` là một Model (MongoDB)
    const Model = data;
    [items, itemCount] = await Promise.all([
      Model.find(query).skip(skip).limit(limit),
      Model.countDocuments(query),
    ]);
  }

  const pageCount = Math.ceil(itemCount / limit);

  return {
    items,
    pagination: {
      pageCount,
      currentPage: page,
      totalItems: itemCount,
    },
  };
}

module.exports = { paginationMiddleware, paginateItems };
