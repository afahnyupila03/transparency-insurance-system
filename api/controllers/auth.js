import jwt from 'jsonwebtoken'
import User from './../models/user'
import Logout from '../../models/logout'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import { models } from './../node_modules/mongoose/types/index.d'

const generateToken = user =>
  jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    'b089525428ab9a5cfb99a2d6a0f9f9994da5602e71548cbb51d78d17e4cf92a7', //secret,
    {
      expiresIn: '7d'
    }
  )

export const authentications = {
  register: async (req, res) => {
    try {
      const { email, password } = req.body

      const existingUser = await User.find({ email: email })

      if (existingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'User with account already exist.'
        })
      }

      const hashedPassword = await bcrypt.hash(password, 24)

      const user = new User({
        email,
        password: hashedPassword
      })

      const data = await user.save()

      const token = generateToken(data)

      res.status(StatusCodes.OK).json({
        message: 'User created',
        data,
        token
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'error creating user profile',
        error: error.message
      })
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email: email })

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'No user with email exist, please create account.'
        })
      }

      const passwordMatch = await bcrypt.compare(password, user.password)

      if (!passwordMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Wrong password, please enter correct password'
        })
      }

      const token = generateToken(user)

      res.status(StatusCodes.OK).json({
        message: 'login to profile completed',
        data: user,
        token
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error logging to user profile',
        error: error.message
      })
    }
  },
  getUser: async (req, res) => {
    try {
      const userId = req.userId

      const user = await User.findById(userId)
        .select('-password')
        .populate('car')

      if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'No user found, please authenticate account.'
        })
      }

      res.status(StatusCodes.OK).json({
        message: 'User profile',
        data: user
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching user profile',
        error: error.message
      })
    }
  },
  logout: async (req, res) => {
    try {
      const authHeader = req.get('Authorization')

      if (!authHeader) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'User account not authenticated'
        })
      }

      const token = authHeader.split(' ')[1]

      if (!token) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          message: 'Token missing'
        })
      }

      const blacklisted = await Logout.findOne({ token: token })

      if (blacklisted) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'User profile already logged out' })
      }

      // Verify the token before blacklisting
      let decodedToken
      try {
        decodedToken = jwt.verify(
          token,
          'b089525428ab9a5cfb99a2d6a0f9f9994da5602e71548cbb51d78d17e4cf92a7'
        )
        console.log('Decoded token:', decodedToken)
      } catch (err) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: 'Invalid or expired token.' })
      }

      // Blacklist token
      const result = await Logout.create({ token })
      console.log('Token blacklisted successfully:', result)

      return res
        .status(StatusCodes.CREATED)
        .json({ message: 'User account logout success', token: result })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error logging out user',
        error: error.message
      })
    }
  }
}
