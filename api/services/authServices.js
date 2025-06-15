import Token from '../models/token.js'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendEmail } from './mailServices.js'
// import crypto from 'crypto'

export const authServices = {
  resetRequest: async email => {
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('User does not exist')
    }

    let token = await Token.findOne({ user: user._id })
    if (token) {
      await token.deleteOne()
    }

    let resetToken = crypto.randomBytes(32).toString('hex')
    const hash = await bcrypt.hash(resetToken, Number(process.env.BCRYPT_SALT))

    await new Token({
      user: user._id,
      token: hash,
      createdAt: Date.now()
    }).save()

    const link = `${process.env.CLIENT_URL}/password-reset?token=${resetToken}&id=${user._id}`
    sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      text: 'Use the link below to reset your password',
      html: `<p>Click <a href="${link}">here</a> to reset your password</p>`
    })
  }
}
