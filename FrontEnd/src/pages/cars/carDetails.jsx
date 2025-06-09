import { Link, useParams } from 'react-router-dom'
import { useCar, useUpdateCarStatus } from '../../hooks/carHook'
import { useState } from 'react'
import { Form, Formik } from 'formik'
import CustomInput from '../../components/customInput'

export default function CarDetailsPage () {
  const params = useParams()

  const [editStatus, setEditStatus] = useState(false)

  const carId = params.id

  const { data, isLoading, isError, error } = useCar(carId)
  const updateCarStatus = useUpdateCarStatus()

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg'>Loading car profiles...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg'>{error}</p>
      </div>
    )
  }

  const {
    regNum,
    name,
    address,
    genre,
    type,
    mark,
    chassisNumber,
    energy,
    hpRating,
    numberOfSeats,
    carryingCapacity,
    firstYear,
    status
  } = data.data

  const statusColor =
    status === 'enabled'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-200 text-gray-600'

  const actions = status => {
    const action = {
      enabled: [
        {
          id: carId,
          label: 'Disable',
          key: 'disabled'
        },
        {
          id: carId,
          label: 'Delete',
          key: 'deleted'
        }
      ],
      disabled: [
        {
          id: carId,
          label: 'Enable',
          key: 'enabled'
        },
        {
          id: carId,
          label: 'Delete',
          key: 'deleted'
        }
      ]
    }

    return action[status] || []
  }

  return (
    <div className='min-h-screen w-full px-6 py-10 bg-gray-100'>
      <div className='max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 space-y-10'>
        <div className='space-y-4'>
          <div className='flex justify-between'>
            <h2 className='text-2xl font-bold text-gray-800'>
              User Information
            </h2>
            <Link to={`/create-car/${carId}?editing=true`}>Update car</Link>
          </div>
          <hr />
          <div className='text-gray-700 space-y-1'>
            <p>
              <span className='font-medium'>Name:</span> {name}
            </p>
            <p>
              <span className='font-medium'>Address:</span> {address}
            </p>
          </div>
        </div>

        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-gray-800'>
              Vehicle Information
            </h2>
            <div>
              {!editStatus ? (
                <div className='flex items-center justify-between gap-4 mt-4'>
                  <div>
                    <span className='font-semibold text-gray-600 mr-2'>
                      Status:
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor}`}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {status}
                    </span>
                    <button
                      type='button'
                      onClick={() => setEditStatus(true)}
                      className='text-blue-600 hover:underline font-medium text-sm'
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ) : (
                <div className='mt-4'>
                  <Formik
                    initialValues={{ status }}
                    onSubmit={async (values, { setSubmitting }) => {
                      await updateCarStatus({
                        id: carId,
                        status: values.status
                      })
                      setEditStatus(false)
                      setSubmitting(false)
                    }}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      values,
                      isSubmitting,
                      errors,
                      touched
                    }) => (
                      <Form className='flex items-center gap-4'>
                        <CustomInput
                          style={{ textTransform: 'capitalize' }}
                          as='select'
                          label='Update Status'
                          name='status'
                          id='status'
                          value={values.status}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors}
                          touched={touched}
                        >
                          {actions(status).map(action => (
                            <option value={action.key} key={action.key}>
                              {action.label}
                            </option>
                          ))}
                        </CustomInput>
                        <button
                          type='submit'
                          disabled={isSubmitting}
                          className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200
    ${isSubmitting ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}`}
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className='w-4 h-4 text-white animate-spin'
                                fill='none'
                                viewBox='0 0 24 24'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <circle
                                  className='opacity-25'
                                  cx='12'
                                  cy='12'
                                  r='10'
                                  stroke='currentColor'
                                  strokeWidth='4'
                                ></circle>
                                <path
                                  className='opacity-75'
                                  fill='currentColor'
                                  d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                                ></path>
                              </svg>
                              Updating...
                            </>
                          ) : (
                            'Update'
                          )}
                        </button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </div>
          <hr />
          <div className='text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <p>
              <span className='font-medium'>Mark:</span> {mark}
            </p>
            <p>
              <span className='font-medium'>Model:</span> {type}
            </p>
            <p>
              <span className='font-medium'>Type of Vehicle:</span> {genre}
            </p>
            <p>
              <span className='font-medium'>Registration No.:</span> {regNum}
            </p>
            <p>
              <span className='font-medium'>Chassis No.:</span>{' '}
              {chassisNumber.slice(-6)}
            </p>
            <p>
              <p>
                <span className='font-medium'>First Use Year:</span>{' '}
                {new Date(firstYear).toLocaleDateString('en-GB')}
              </p>
            </p>
            <p>
              <span className='font-medium'>Energy Source:</span> {energy}
            </p>
            <p>
              <span className='font-medium'>No. of Seats:</span> {numberOfSeats}
            </p>
            <p>
              <span className='font-medium'>HP Rating:</span> {hpRating} CV
            </p>
            <p>
              <span className='font-medium'>Carrying Capacity:</span>{' '}
              {carryingCapacity} KG
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
