import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import Logout from '../../models/logout.js'
import User from '../../models/user.js'

const JWT_SECRET = process.env.JWT_SECRET

export const authAuthorization = {
  auth: async (req, res, next) => {
    try {
      const authHeader = req.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'Authorization header is missing or invalid'
        })
      }

      const parts = authHeader.split(' ')
      if (parts.length !== 2 || !parts[1]) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'Malformed token'
        })
      }
      const token = parts[1]
      if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'User token missing'
        })
      }

      const blacklisted = await Logout.findOne({ token })
      if (blacklisted) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: 'Token is invalid. Please log in again' })
      }

      let decoded = null

      // decoded = jwt.verify(token, JWT_SECRET)
      try {
        decoded = jwt.verify(token, JWT_SECRET)
      } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          message: 'Invalid or expired token',
          error: error.message
        })
      }

      if (!decoded) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: 'Invalid or expired token decoded'
        })
      }

      const user = await User.findById(decoded.id)

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'User not found'
        })
      }

      if (user.status !== 'enabled') {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: 'Account is not active'
        })
      }

      req.user = {
        id: user._id,
        email: user.email,
        carOwner: user.isCarOwner
      }

      next()
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to authenticate user',
        error: error.message
      })
    }
  }
}
