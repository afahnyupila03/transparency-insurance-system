import React, { useState } from 'react'

import { Form, Formik } from 'formik'
import CustomInput from '../../components/customInput'
import { AppState } from '../../store/context'

export default function Authentication () {
  const [existingUser, setExistingUser] = useState(false)
  const { signinHandler, signupHandler, loading } = AppState()

  const existingUserHandler = () => {
    setTimeout(() => {
      setExistingUser(prevState => !prevState)
    }, 200)
  }

  const registerUserHandler = async (values, actions) => {
    try {
      await signupHandler(values)
      actions.resetForm({
        values: {
          email: '',
          password: ''
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  const loginUserHandler = async (values, actions) => {
    try {
      await signinHandler(values)
      actions.resetForm({
        values: {
          email: '',
          password: ''
        }
      })
    } catch (error) {
      throw new Error(error)
    }
  }

  return (
    <div>
      <Formik
        initialValues={{ email: '', password: '' }}
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
              autoComplete={false}
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
              placeholder='Enter password'
              autoComplete={false}
            />

            <div className='flex'>
              <p>{!existingUser ? 'Login' : 'Signup'}</p>
              <button type='button' onClick={existingUserHandler}>
                {!existingUser ? 'Signup' : 'Login'}
              </button>
            </div>

            <div className='mt-4'>
              <button
                type='submit'
                disabled={(isSubmitting && loading) || !isValid}
              >
                {loading ? 'Loading...' : !existingUser ? 'Login' : 'Signup'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
