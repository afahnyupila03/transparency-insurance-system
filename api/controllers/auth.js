import jwt from 'jsonwebtoken'
import User from './../models/user.js'
import Logout from './../models/logout.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'

const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    'b089525428ab9a5cfb99a2d6a0f9f9994da5602e71548cbb51d78d17e4cf92a7', //secret,
    {
      expiresIn: '7d'
    }
  )
}

export const userProfiles = {
  register: async (req, res) => {
    const { email, password } = req.body

    const existingUser = await User.findOne({ email: email })
    console.log(existingUser)

    if (existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User with account already exist.'
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      email,
      password: hashedPassword
    })
    console.log(user)

    const data = await user.save()

    const token = generateToken(data)

    console.log(data, token)

    return res.status(StatusCodes.CREATED).json({
      message: 'User created',
      data,
      token
    })
  },
  login: async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'No user with email exist, please create account.'
      })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Wrong password, please enter correct password'
      })
    }

    const token = generateToken(user)

    res.status(StatusCodes.CREATED).json({
      message: 'login to profile completed',
      data: user,
      token
    })
  },
  updateProfile: async (req, res) => {
    const { name, phone } = req.body
    const userId = req.user.id

    // if (!userId) {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     error: 'Please authenticate account to update profile.'
    //   })
    // }

    // Check if another user already has this name
    const nameExists = await User.findOne({ name, _id: { $ne: userId } })
    if (nameExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Another user with this name already exists.'
      })
    }

    // Check if another user already has this phone
    const phoneExists = await User.findOne({ phone, _id: { $ne: userId } })
    if (phoneExists) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Another user with this phone number already exists.'
      })
    }

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone },
      { new: true, runValidators: true }
    )

    res.status(StatusCodes.CREATED).json({
      message: 'User profile updated.',
      data: updatedUser
    })
  },
  updateEmail: async (req, res) => {
    const userId = req.user.id

    const { email: newEmail } = req.body

    if (!newEmail || typeof newEmail !== 'string' || newEmail.trim() === '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'New email is required and must not be an empty string.'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'User not found.'
      })
    }
    const oldEmail = user.email

    if (oldEmail === newEmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'New email can not be the same as old email'
      })
    }

    const emailIsTaken = await User.findOne({ email: newEmail })

    if (emailIsTaken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Email is already in use by another user.'
      })
    }

    user.email = newEmail.trim()
    await user.save()

    res.status(StatusCodes.OK).json({
      message: 'Email successfully updated.',
      data: user.email
    })
  },
  updatePassword: async (req, res) => {
    const userId = req.user.id

    const { password: newPassword } = req.body

    if (!newPassword || typeof newPassword.trim() !== 'string' || '') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Password is required and must be a string'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: 'No user found, please create account.'
      })
    }

    const existingPassword = user.password

    if (existingPassword === newPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'New password can not be the same as old password'
      })
    }

    const hashPassword = await bcrypt.hash(newPassword, 10)

    user.password = hashPassword
    await user.save()

    res.status(StatusCodes.OK).json({
      message: 'Password successfully updated'
    })
  },
  getUser: async (req, res) => {
    const userId = req.user.id

    // if (!userId) {
    //   return res.status(StatusCodes.UNAUTHORIZED).json({
    //     error: 'No user found, please authenticate account.'
    //   })
    // }

    const user = await User.findById(userId).select('-password').populate('car')

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'User profile not found'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'User profile',
      data: user
    })
  },
  logout: async (req, res) => {
    const authHeader = req.get('Authorization')

    if (!authHeader) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'User account not authenticated'
      })
    }

    const token = authHeader.split(' ')[1]

    if (!token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Token missing'
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
  }
}
