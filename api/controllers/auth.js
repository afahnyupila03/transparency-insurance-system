import jwt from 'jsonwebtoken'
import User from './../models/user.js'
import Logout from './../models/logout.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import Token from '../models/token.js'
import { sendEmail } from '../services/mailServices.js'

const generateToken = user => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    process.env.JWT_SECRET, //secret,
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

    const hashedPassword = await bcrypt.hash(password, process.env.BCRYPT_SALT)

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
  requestPasswordReset: async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      // For security, don't expose whether email exists
      return res.status(StatusCodes.OK).json({
        message: 'If the email exists, a reset link will be sent'
      })
    }

    // Delete old token if exists
    const token = await Token.findOne({ user: user._id })
    if (token) {
      await token.deleteOne()
    }

    // Create secure token
    let resetToken = crypto.randomUUID().trim()
    console.log('reset-token: ', resetToken)
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT))
    console.log('salt value: ', process.env.BCRYPT_SALT)

    // Save token in DB
    await new Token({
      user: user._id,
      token: hash,
      createdAt: Date.now()
    }).save()

    // Construct reset link
    const link = `${process.env.CLIENT_URL}/password-reset?token=${resetToken}&id=${user._id}`

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request',
        text: 'Use the link below to reset your password',
        html: `<p>Click <a href="${link}">here</a> to reset your password</p>`
      })

      res.status(StatusCodes.OK).json({
        message: 'If the email exists, a reset link will be sent'
      })
    } catch (err) {
      console.error('🚨 Send email error:', err.message)

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: err.message || 'Could not send email'
      })
    }
  },
  resetPassword: async (req, res) => {
    const { password } = req.body
    const { id, token } = req.query

    console.log('query token: ', token)

    let passwordResetToken = await Token.findOne({ user: id })

    if (!passwordResetToken) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'password-reset-token-Invalid or expired password reset token'
      })
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token)
    console.log('token match result: ', isValid)

    if (!isValid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'invalid-Invalid or expired password reset token'
      })
    }

    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT))

    await User.updateOne(
      { _id: id },
      { $set: { password: hash } },
      { new: true }
    )

    const user = await User.findById(id)

    await sendEmail({
      to: user.email,
      subject: 'Password reset success.',
      text: 'Your password has been successfully reset'
    })

    await passwordResetToken.deleteOne()

    return res.status(StatusCodes.OK).json({
      message: 'Password reset complete'
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
