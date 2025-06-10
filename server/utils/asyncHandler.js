function asyncHandler(fn) {
  return async function(req, res, next) {
    try {
      await fn(req, res, next);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

module.exports = asyncHandler;
