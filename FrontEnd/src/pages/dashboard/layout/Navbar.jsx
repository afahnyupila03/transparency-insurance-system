import React from 'react'
import { Link } from 'react-router-dom'

function Navbar () {
  return (
    <div className='w-full flex flex-row-reverse justify-end px-6 py-4 bg-white shadow-sm'>
      <Link
        to='/cars'
        className='text-sm ml-4 font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-full transition'
      >
         car
      </Link>

      <Link
        to='/create-car'
        className='text-sm font-medium text-blue-600 bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded-full transition'
      >
        Create Cars
      </Link>
    </div>
  )
}

export default Navbar
