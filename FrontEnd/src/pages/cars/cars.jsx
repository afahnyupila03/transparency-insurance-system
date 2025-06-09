import { useNavigate } from 'react-router-dom'
import CarListContainer from '../../components/CarListItems'
import { useCars, useUpdateCarStatus } from '../../hooks/carHook'

const carActions = (car, zone) => {
  const status = car.status
  const id = car._id

  const actions = {
    enabled: [
      {
        id,
        type: 'link',
        link: `${id}`,
        label: 'View',
        key: 'view'
      },
      {
        id,
        type: 'link',
        link: `cars/${id}`,
        query: {
          editing: true
        },
        label: 'Update',
        key: 'update'
      },
      {
        id,
        type: 'link',
        link: `cars/${id}`,
        query: {
          zone
        },
        label: 'Eligible Policy',
        key: 'eligiblePolicy'
      },
      {
        id,
        type: 'link',
        link: `cars/${id}/quotations`,
        label: 'Quotation history',
        key: 'quotationHistory'
      },
      {
        id,
        type: 'button',
        label: 'Disable',
        key: 'disabled'
      },
      {
        id,
        type: 'button',
        label: 'Delete',
        key: 'deleted'
      }
    ],
    disabled: [
      {
        id,
        type: 'link',
        link: `cars/${id}`,
        label: 'View',
        key: 'view'
      },
      {
        id,
        type: 'button',
        label: 'Enable',
        key: 'enabled'
      },
      {
        id,
        type: 'button',
        label: 'Delete',
        key: 'deleted'
      }
    ]
  }

  return actions[status] || []
}

export default function CarsPage () {
  const { cars, isLoading, isError, error } = useCars()
  const updateCarStatus = useUpdateCarStatus()

  const navigate = useNavigate()

  const isAccessDenied =
    isError && error?.message === 'Access denied. You are not a car owner'

  const updateCarStatusHandler = async (id, status) => {
    await updateCarStatus({ id, status: status })
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg'>Loading car profiles...</p>
      </div>
    )
  }

  return (
    <div className='min-h-screen w-full px-8 py-10 bg-gray-100'>
      {isAccessDenied || (cars && cars.length === 0) ? (
        <div className='text-center bg-yellow-100 border border-yellow-300 p-6 rounded-lg max-w-md mx-auto'>
          <p className='mb-4 text-yellow-800 font-medium'>
            You have no car profiles yet.
          </p>
          <button
            onClick={() => navigate('/create-car')}
            className='cursor-pointer px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition'
          >
            Create Car Profile
          </button>
        </div>
      ) : isError ? (
        <div className='bg-red-100 border border-red-300 p-4 rounded text-red-700 text-center max-w-md mx-auto'>
          <p>{error.message}</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {cars.map(car => (
            <CarListContainer
              key={car._id}
              data={car}
              actions={carActions(car)}
              actionHandler={action => {
                if (action.key === 'disabled') {
                  updateCarStatusHandler(car._id, 'disabled')
                } else if (action.key === 'deleted') {
                  updateCarStatusHandler(car._id, 'deleted')
                } else if (action.key === 'enabled') {
                  updateCarStatusHandler(car._id, 'enabled')
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
