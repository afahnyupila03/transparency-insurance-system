import Token from '../models/token.js'
import User from '../models/user.js'
import Logout from '../models/logout.js'
import bcrypt from 'bcrypt'
import { sendEmail } from './mailServices.js'
// import crypto from 'crypto'
import { generateToken } from './../utils/jwt.js'

const handleDeactivatedAccounts = async user => {
  if (user.status === 'disabled') {
    // Update user to enabled after successful login.
    user.status = 'enabled'
    await user.save()
  } else if (user.status === 'deactivated' && user.deactivatedTime) {
    const now = new Date()
    const diffInDays = (now - user.deactivatedTime) / (1000 * 60 * 60 * 24)

    if (diffInDays > 30) {
      // Update user to deleted after 30 days.
      user.status = 'deleted'
    } else {
      user.status = 'enabled'
    }
    await user.save()
  }
}

const ACTIVE_STATUSES = ['enabled', 'deactivated', 'disabled']
const saltRounds = Number(process.env.BCRYPT_SALT)

export const authServices = {
  registerService: async (email, password) => {
    const existingUser = await User.findOne({ email })

    if (
      existingUser &&
      (existingUser.status === 'enabled' ||
        existingUser.status === 'deactivated' ||
        existingUser.status === 'disabled')
    ) {
      return null
    }

    const hashPassword = await bcrypt.hash(password, saltRounds)

    const user = new User({
      email,
      password: hashPassword
    })
    await user.save()

    const token = generateToken(user)

    return { user, token }
  },
  loginService: async (email, password) => {
    // When checking to login user, don't return user with status: 'deleted'.
    const user = await User.findOne({ email, status: { $ne: 'deleted' } })

    if (!user) {
      return null
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return null
    }

    await handleDeactivatedAccounts(user)

    if (user.status === 'deleted') {
      return null // Just in case, after handleDeactivation.
    }

    const token = generateToken(user)

    return { user, token }
  },
  updateUserStatus: async (id, status) => {
    if (!status || !['deactivated', 'deleted', 'disabled'].includes(status)) {
      return null
    }

    const user = await User.findOne({ _id: id, status: 'enabled' })
    if (!user) {
      return null
    }

    if (status === 'disabled') {
      user.status = 'disabled'
    }

    if (status === 'deleted') {
      // First set status to deactivated
      user.status = 'deactivated'
      user.deactivatedTime = new Date()
    }

    await user.save()

    return user
  },
  updateProfileService: async (id, name, phone) => {
    if (!name || !phone) {
      return null
    }

    name = name.trim()
    phone = phone.trim()

    const existingUser = await User.findOne({
      _id: { $ne: id },
      status: { $in: ACTIVE_STATUSES },
      $or: [{ name: name }, { phone: phone }]
    })

    if (existingUser) {
      return null
    }

    const user = await User.findByIdAndUpdate(
      id,
      { name, phone },
      { new: true, runValidators: true }
    )

    if (!user) {
      return null
    }

    return user
  },
  updateEmailService: async (id, email) => {
    if (!email) {
      return null
    }

    email = email.trim()

    const user = await User.findById(id)

    if (!user) {
      return null
    }

    const existingEmail = await User.findOne({
      _id: { $ne: id },
      email,
      status: { $in: ACTIVE_STATUSES }
    })

    if (existingEmail) {
      return null
    }

    if (user.email === email) {
      return null
    }

    user.email = email
    await user.save()

    return user
  },
  updatePasswordService: async (id, password) => {
    if (!password) {
      return null
    }

    const user = await User.findOne({ _id: id, status: 'enabled' })

    if (!user) {
      return null
    }

    const isSamePassword = await bcrypt.compare(password, user.password)

    if (isSamePassword) {
      return null
    }

    const hash = await bcrypt.hash(password, saltRounds)
    user.password = hash
    await user.save()

    return user
  },
  resetRequest: async email => {
    if (!email) {
      throw new Error('Email is required')
    }

    email = email.trim()

    const user = await User.findOne({ email, status: 'enabled' })
    if (!user) {
      return null
    }

    let token = await Token.findOne({ user: user._id })
    // Delete old token if exists
    if (token) {
      await token.deleteOne()
    }

    // Create secure token.
    let resetToken = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(resetToken, saltRounds)

    await new Token({
      user: user._id,
      token: hash,
      createdAt: Date.now()
    }).save()

    const link = `${process.env.CLIENT_URL}/password-reset?token=${resetToken}&id=${user._id}`
    await sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: 'Use the link below to reset your password',
      html: `<p>Click <a href="${link}">here</a> to reset your password</p>`
    })
  },
  resetPasswordService: async (id, token, password) => {
    const user = await User.findById(id)
    if (!user) {
      return null
    }

    if (!password) {
      return null
    }

    let passwordResetToken = await Token.findOne({ user: id })
    if (!passwordResetToken) {
      return null
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token)

    if (!isValid) {
      return null
    }

    const hash = await bcrypt.hash(password, saltRounds)

    user.password = hash
    await user.save()

    await sendEmail({
      to: user.email,
      subject: 'Password reset success.',
      text: 'Your password has been successfully reset'
    })

    await passwordResetToken.deleteOne()
  },
  getUserService: async id => {
    const user = await User.findOne({ _id: id, status: 'enabled' }).select(
      '-password'
    )

    if (!user) {
      return null
    }

    return user
  },
  logoutService: async req => {
    const authHeader = req.get('Authorization')
    if (!authHeader) throw new Error('No authorization header')

    const token = authHeader.split(' ')[1]
    if (!token) throw new Error('Token not found')

    const blacklisted = await Logout.findOne({ token: token })
    if (blacklisted) throw new Error('Token already blacklisted')

    // Verify the token before blacklisting
    let decodedToken
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      throw new Error('Invalid token')
    }

    // Blacklist token
    const result = await Logout.create({ token })

    return result
  }
}
