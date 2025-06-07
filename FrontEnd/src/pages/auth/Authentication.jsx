import { useState } from 'react'
import { Form, Formik } from 'formik'
import CustomInput from '../../components/customInput'
import { AppState } from '../../store/context'

import * as Yup from 'yup'

export default function Authentication () {
  const [existingUser, setExistingUser] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signinHandler, signupHandler, loading } = AppState()

  const authValidators = Yup.object().shape({
    email: Yup.string()
      .trim()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be 6 characters long')
      .matches(/[A-Z]/, 'Password must include at least one uppercase letter')
      .matches(
        /[!@#$%^&*(),.?":{}|<>]/,
        'Password must include at least one special character'
      )
  })

  const existingUserHandler = () => {
    setTimeout(() => {
      setExistingUser(prev => !prev)
    }, 200)
  }

  const registerUserHandler = async (values, actions) => {
    try {
      await signupHandler(values)
      actions.resetForm({ values: { email: '', password: '' } })
    } catch (error) {
      throw new Error(error)
    }
  }

  const loginUserHandler = async (values, actions) => {
    try {
      await signinHandler(values)
      actions.resetForm({ values: { email: '', password: '' } })
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 px-4'>
      <div className='bg-white p-6 rounded-lg shadow-md w-full max-w-md'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>
          {existingUser ? 'Sign Up' : 'Login'}
        </h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={authValidators}
          onSubmit={!existingUser ? loginUserHandler : registerUserHandler}
        >
          {({
            handleChange,
            handleBlur,
            values,
            isSubmitting,
            isValid,
            errors,
            touched
          }) => (
            <Form>
              <CustomInput
                type='email'
                id='email'
                name='email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                error={errors}
                touched={touched}
                label='Email'
                placeholder='Enter email'
                autoComplete='off'
              />

              <CustomInput
                type='password'
                id='password'
                name='password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                error={errors}
                touched={touched}
                label='Password'
                showPassword={showPassword}
                togglePassword={() => setShowPassword(prev => !prev)}
                placeholder='Enter password'
                autoComplete='off'
              />

              <div className='flex items-center justify-between text-sm mt-4'>
                <p className='text-gray-600'>
                  {existingUser ? 'Already have an account?' : 'New here?'}
                </p>
                <button
                  type='button'
                  onClick={existingUserHandler}
                  className='text-blue-500 hover:underline'
                >
                  {existingUser ? 'Login' : 'Sign Up'}
                </button>
              </div>

              <button
                type='submit'
                disabled={(isSubmitting && loading) || !isValid}
                className={`w-full mt-6 py-2 rounded-md text-white font-semibold ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? 'Loading...' : existingUser ? 'Sign Up' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
