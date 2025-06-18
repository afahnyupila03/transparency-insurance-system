import jwt from 'jsonwebtoken'
import User from './../models/user.js'
import Logout from './../models/logout.js'
import { StatusCodes } from 'http-status-codes'
import bcrypt from 'bcrypt'
import Token from '../models/token.js'
import { sendEmail } from '../services/mailServices.js'
import { authServices } from '../services/authServices.js'

export const userProfiles = {
  register: async (req, res) => {
    const { email, password } = req.body

    const result = await authServices.registerService(email, password)

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid email or password'
      })
    }

    return res.status(StatusCodes.CREATED).json({
      message: 'User created',
      data: result.user,
      token: result.token
    })
  },
  login: async (req, res) => {
    const { email, password } = req.body

    const result = await authServices.loginService(email, password)

    if (!result) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: 'Invalid email or password'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'login to profile completed',
      data: result.user,
      token: result.token
    })
  },
  updateProfileStatus: async (req, res) => {
    const id = req.user.id
    const { status } = req.body

    const result = await authServices.updateUserStatus(id, status)

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid valid status'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'Profile status updated',
      data: result
    })
  },
  updateProfile: async (req, res) => {
    const { name, phone } = req.body
    const userId = req.user.id

    const result = await authServices.updateProfileService(userId, name, phone)

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Error updating profile'
      })
    }

    res.status(StatusCodes.CREATED).json({
      message: 'User profile updated.',
      data: result
    })
  },
  updateEmail: async (req, res) => {
    const userId = req.user.id

    const { email: newEmail } = req.body

    const result = await authServices.updateEmailService(userId, newEmail)

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid email'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'Email successfully updated.',
      data: result
    })
  },
  updatePassword: async (req, res) => {
    const userId = req.user.id

    const { password: newPassword } = req.body

    const updatedPassword = await authServices.updatePasswordService(
      userId,
      newPassword
    )

    if (!updatedPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Password cannot be same as current or user not found'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'Password successfully updated'
    })
  },
  requestPasswordReset: async (req, res) => {
    const { email } = req.body

    await authServices.resetRequest(email)

    res.status(StatusCodes.OK).json({
      message: 'If the email exists, a reset link will be sent'
    })
  },
  resetPassword: async (req, res) => {
    const { password } = req.body
    const { id, token } = req.query

    const resetPassword = await authServices.resetPasswordService(
      id,
      token,
      password
    )

    if (!resetPassword) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Invalid or expired reset token'
      })
    }

    return res.status(StatusCodes.OK).json({
      message: 'Password reset complete'
    })
  },
  getUser: async (req, res) => {
    const userId = req.user.id

    const result = await authServices.getUserService(userId)

    if (!result) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Failed to get user data'
      })
    }

    res.status(StatusCodes.OK).json({
      message: 'User profile',
      data: result
    })
  },
  logout: async (req, res) => {
    await authServices.logoutService(req)

    return res
      .status(StatusCodes.CREATED)
      .json({ message: 'User account logout success' })
  }
}
