import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import Logout from './../models/logout.js'
import User from './../models/user.js'

const JWT_SECRET =
  'b089525428ab9a5cfb99a2d6a0f9f9994da5602e71548cbb51d78d17e4cf92a7'

export const middlewares = {
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

      req.user = {
        id: user._id,
        email: user.email
      }

      next()
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to authenticate user',
        error: error.message
      })
    }
  },
  carOwner: async (req, res, next) => {
    try {
      const userId = req.user.id

      if (!userId) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
          error: 'User not authenticated'
        })
      }

      const user = await User.findById(userId)

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'User not found'
        })
      }

      if (!user.isCarOwner) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: 'Access denied. You are not a car owner'
        })
      }

      next()
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to verify car owner status',
        error: error.message
      })
    }
  }
}
