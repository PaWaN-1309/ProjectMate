// Response formatting utility
const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Success responses
const sendSuccess = (res, message, data = null, statusCode = 200) => {
  return sendResponse(res, statusCode, true, message, data);
};

// Error responses
const sendError = (res, message, statusCode = 400) => {
  return sendResponse(res, statusCode, false, message);
};

// Paginated response
const sendPaginatedResponse = (res, message, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination
  });
};

// Calculate pagination
const getPagination = (page, limit, total) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.ceil(total / pageSize);

  return {
    currentPage,
    pageSize,
    skip,
    totalPages,
    total,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1
  };
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError,
  sendPaginatedResponse,
  getPagination
};