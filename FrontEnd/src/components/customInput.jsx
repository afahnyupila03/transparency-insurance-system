import React from 'react'
import { Field } from 'formik'
import IconComponent from './IconComponent'

export default function CustomInput ({
  id,
  name,
  error,
  touched,
  label,
  rows = 3,
  type,
  showPassword,
  value,
  togglePassword,
  children,
  ...props
}) {
  const isError = error?.[name] && touched?.[name]

  return (
    <div className='mb-4'>
      {type === 'checkbox' ? (
        <div className='flex items-center space-x-2'>
          <Field
            type='checkbox'
            name={name}
            id={id}
            className={`h-4 w-4 text-blue-600 border-gray-300 rounded ${
              isError ? 'border-red-500' : ''
            }`}
            {...props}
          />
          <label htmlFor={id} className='text-sm font-medium text-gray-700'>
            {label}
          </label>
        </div>
      ) : (
        <>
          <label
            htmlFor={id}
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            {label}
          </label>

          <div className='relative'>
            {props.as === 'select' ? (
              <Field
                as='select'
                name={name}
                id={id}
                className={`w-full px-3 py-2 border ${
                  isError ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...props}
              >
                {children}
              </Field>
            ) : props.as === 'textarea' ? (
              <Field
                as='textarea'
                name={name}
                id={id}
                rows={rows}
                className={`w-full px-3 py-2 border ${
                  isError ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...props}
              />
            ) : (
              <Field
                type={type === 'password' && showPassword ? 'text' : type}
                name={name}
                id={id}
                className={`w-full px-3 py-2 pr-10 border ${
                  isError ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...props}
              />
            )}

            {name === 'password' && value && (
              <button
                type='button'
                onClick={togglePassword}
                className='absolute inset-y-0 right-2 flex items-center text-gray-500'
              >
                {showPassword ? (
                  <IconComponent name='IoIosEyeOff' />
                ) : (
                  <IconComponent name='IoIosEye' />
                )}
              </button>
            )}
          </div>
        </>
      )}

      {isError && <p className='text-sm text-red-500 mt-1'>{error[name]}</p>}
    </div>
  )
}
