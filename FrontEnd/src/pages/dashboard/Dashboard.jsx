import { useEffect } from 'react'
import { useCars } from '../../hooks/carHook'
import { useNavigate } from 'react-router-dom'

export default function Dashboard () {
  const { data, isLoading, isError, error } = useCars()
  const navigate = useNavigate()

  const isAccessDenied =
    isError && error?.message === 'Access denied. You are not a car owner'

  useEffect(() => {
    if (data && data.length === 0) {
      console.log('No car profiles created')
    } else if (data) {
      console.log('car data: ', data)
    }
  }, [data])

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='max-w-2xl mx-auto px-4 py-10'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Dashboard</h1>

      {isAccessDenied || (data && data.length === 0) ? (
        <div className='text-center bg-yellow-100 border border-yellow-300 p-6 rounded-lg'>
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
        <div className='bg-red-100 border border-red-300 p-4 rounded text-red-700 text-center'>
          <p>{error.message}</p>
        </div>
      ) : (
        <div className='bg-green-100 border border-green-300 p-6 rounded-lg text-green-800 text-center'>
          <p className='font-medium'>
            Welcome! You have {data.length} car profile{data.length > 1 && 's'}.
          </p>
          {/* You can render the actual car list here if needed */}
        </div>
      )}
    </div>
  )
}
