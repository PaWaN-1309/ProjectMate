// Async handler wrapper to avoid try-catch in every controller
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate project colors
const getRandomProjectColor = () => {
  const colors = ['blue', 'green', 'red', 'purple', 'yellow', 'indigo', 'pink', 'gray'];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Validate email format
const isValidEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Sanitize user input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

// Format date for response
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

// Calculate progress percentage
const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

module.exports = {
  asyncHandler,
  generateRandomString,
  getRandomProjectColor,
  isValidEmail,
  sanitizeInput,
  formatDate,
  calculateProgress
};