/**
 * Catch-all for unmatched routes.
 * Returns 404 JSON response.
 */
const notFound = (req, res) => {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

module.exports = { notFound };
