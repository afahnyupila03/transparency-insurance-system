import { StatusCodes } from 'http-status-codes'

export const validate =
  (schema, source = 'body') =>
  async (req, res, next) => {
    try {
      await schema.validate(req[source], {
        abortEarly: false,
        context: {
          userId: req.user?.id,
          req
        }
      })
      next()
    } catch (err) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Validation error',
        error: err.errors || err.message
      })
    }
  }

export const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}
