export default function PageNotFound () {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100 p-6'>
      <div className='max-w-md text-center bg-white p-8 rounded-lg shadow-lg'>
        <h1 className='text-5xl font-bold text-gray-800 mb-4'>404</h1>
        <p className='text-xl text-gray-600 mb-6'>
          Uh-oh! This page isn’t functional yet — we're working on it.
        </p>
        <p className='text-gray-500 mb-8'>
          You can head back to the{' '}
          <Link to='/cars' className='text-blue-500 hover:underline'>
            homepage
          </Link>{' '}
          or check out the menu.
        </p>
        <button
          onClick={() => window.history.back()}
          className='px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md transition'
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
