// Centralized error handling middleware
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)

  // Log full error on server
  console.error(err.stack || err)

  res.json({
    success: false,
    message: err.message || 'Internal Server Error',
    // include stack in non-production for debugging
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {})
  })
}
