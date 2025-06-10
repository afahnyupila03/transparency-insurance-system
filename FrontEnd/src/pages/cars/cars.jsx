import { useNavigate } from 'react-router-dom'
import CarListContainer from '../../components/CarListItems'
import { useCars, useUpdateCarStatus } from '../../hooks/carHook'
import { Fragment, useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useZones } from '../../hooks/policyHook'

const carActions = car => {
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
        type: 'button',
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

  const [showModal, setShowModal] = useState(false)

  const [selectedId, setSelectedId] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')

  const navigate = useNavigate()

  const isAccessDenied =
    isError && error?.message === 'Access denied. You are not a car owner'

  const updateCarStatusHandler = async (id, status) => {
    await updateCarStatus({ id, status: status })
  }

  const filteredCars = cars?.filter(car => {
    const term = searchTerm.toLowerCase()
    return (
      car.regNum?.toLowerCase().includes(term) ||
      car.chassisNumber?.toLowerCase().includes(term)
    )
  })

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg'>Loading car profiles...</p>
      </div>
    )
  }

  return (
    <Fragment>
      <Modal
        showModal={showModal}
        closeModalHandler={() => setShowModal(false)}
        id={selectedId}
      />

      <div className='min-h-screen w-full px-8 py-10 bg-gray-100'>
        <div className='flex justify-end mb-6'>
          <input
            type='text'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder='Search by Reg. No or Chassis No'
            className='px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full max-w-xs'
          />
        </div>

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
            {filteredCars.map(car => (
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
                  } else if (action.key === 'eligiblePolicy') {
                    setShowModal(true)
                    setSelectedId(action.id)
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Fragment>
  )
}

const Modal = ({ showModal, closeModalHandler, id }) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedZone, setSelectedZone] = useState(null)
  const navigate = useNavigate()

  const limit = 10
  const bottomRef = useRef()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useZones(debouncedSearch, limit)

  // debounce input
  const handleSearchChange = e => {
    const val = e.target.value
    setSearch(val)
    debounced(val)
  }

  const debounced = useRef(
    debounce(value => {
      setDebouncedSearch(value)
    }, 500)
  ).current

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    const current = bottomRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [fetchNextPage, hasNextPage])

  const handleClose = () => {
    closeModalHandler()
    setSearch('')
    setDebouncedSearch('')
    setSelectedZone(null)
  }

  const allZones = data?.pages.flatMap(page => page.data) || []

  console.log('id value: ', id)
  console.log('selectedZoneId: ', selectedZone)

  return (
    <Dialog open={showModal} onClose={handleClose} className='relative z-10'>
      <DialogBackdrop className='fixed inset-0 bg-gray-500/75' />

      <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
        <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
          <DialogPanel className='relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg'>
            <div className='p-4'>
              <input
                type='search'
                placeholder='Search zone'
                value={search}
                onChange={handleSearchChange}
                className='w-full p-2 border mb-2'
              />

              {isLoading ? (
                <p className='text-gray-600 text-sm'>Loading zones...</p>
              ) : isError ? (
                <p className='text-red-500 text-sm'>Error: {error.message}</p>
              ) : (
                <ul className='max-h-60 overflow-y-auto px-2'>
                  {allZones.map((zone, index) => (
                    <li
                      onClick={() =>
                        navigate(`/policies?id=${id}&zone=${zone._id}`)
                      }
                      key={index}
                      className='py-1 border-b hover:bg-gray-100 cursor-pointer transition-colors duration-150'
                    >
                      {zone.name}
                    </li>
                  ))}
                  <li ref={bottomRef} />
                  {isFetchingNextPage && <li>Loading more...</li>}
                </ul>
              )}
            </div>

            {/* Footer Actions */}
            <div className='bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
              <button
                onClick={handleClose}
                className='mt-3 inline-flex justify-center bg-white px-3 py-2 text-sm text-gray-900 border rounded sm:mt-0 sm:ml-3'
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}
