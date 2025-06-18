import * as yup from 'yup'
import User from './../models/user.js'

export const authValidators = {
  registerSchema: yup.object({
    email: yup
      .string()
      .trim()
      .email('Invalid email format')
      .required('Email is required')
      .test('email_exist', 'Email already exist', async value => {
        if (!value) return false

        const existingUser = await User.findOne({ email: value })
        return !existingUser
      }),
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be 6 characters long')
      .matches(/[A-Z]/, 'Password must include at least 1 uppercase letter')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must include at least 1 special character'
      )
  }),
  loginSchema: yup.object({
    email: yup
      .string()
      .trim()
      .email('Please enter valid email format')
      .required('Email is required')
      .test(
        'email_not-found',
        'Email not found, please create an account',
        async value => {
          if (!value) return false
          const newEmail = await User.findOne({ email: value })
          return newEmail
        }
      ),
    password: yup.string().required('Please enter password')
  }),
  updateStatusSchema: yup.object({
    status: yup.string().trim().required('Status is required')
  }),
  updateProfileSchema: yup.object({
    name: yup
      .string()
      .trim()
      .required('Name is required')
      .min(4, 'Name must at least 4 characters'),
    phone: yup
      .number()
      .required('Phone number is required')
      .min(9, 'Phone number must be 9 digits long')
  }),
  updateEmailSchema: yup.object({
    email: yup
      .string()
      .trim()
      .email('Please enter a valid email format')
      .required('Email is required')
      .test(
        'old_email',
        'New email can not be the same as old email',
        async function (value) {
          const { userId } = this.options.context || {}

          if (!value || !userId) return true

          const user = await User.findById(userId)
          if (!user) return true

          return user.email !== value.trim()
        }
      )
      .test(
        'existing_email',
        'Email already in use by another user',
        async function (value) {
          if (!value) return false

          const existingEmail = await User.findOne({ email: value.email })
          return !existingEmail
        }
      )
  }),
  updatePasswordSchema: yup.object({
    password: yup
      .string()
      .trim()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters long')
      .matches(/[A-Z]/, 'Password must have at least 1 uppercase letter')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must have at least 1 special character'
      )
  }),
  requestRestPasswordSchema: yup.object({
    email: yup
      .string()
      .trim()
      .email('Please enter valid email format')
      .required('Email is required')
  }),
  resetPasswordSchema: yup.object({
    password: yup
      .string()
      .required('Password is required')
      .min(6, 'Password must be 6 characters long')
      .matches(/[A-Z]/, 'Password must include at least 1 uppercase letter')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must include at least 1 special character'
      )
  })
}
