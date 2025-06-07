import React from 'react'
import { Field } from 'formik'

export default function CustomInput ({
  id,
  name,
  error,
  touched,
  label,
  rows = 3,
  ...props
}) {
  return (
    <div>
      <div>
        <label id={id} htmlFor={id}>
          {label}
        </label>
        <div>
          {props.as === 'select' ? (
            <Field as='select' name={name} id={id} {...props} />
          ) : props.as === 'textarea' ? (
            <Field
              as='textarea'
              name={name}
              id={id}
              {...props}
              rows={rows || 3}
            />
          ) : (
            <Field name={name} id={id} {...props} />
          )}
        </div>
        {error[name] && touched[name] && <p>{error[name]}</p>}
      </div>
    </div>
  )
}
