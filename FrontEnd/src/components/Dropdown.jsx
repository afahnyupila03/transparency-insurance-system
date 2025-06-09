import { useState } from 'react'
import { Link } from 'react-router-dom'
import IconComponent from './IconComponent'

export default function DropdownComponent ({ actions, actionHandler }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(prev => !prev)

  return (
    <div className='relative inline-block text-left'>
      {/* Dropdown Toggle */}
      <button
        onClick={toggleDropdown}
        className='p-2 hover:bg-gray-100 rounded-full'
      >
        <IconComponent name='IoMdMore' />
      </button>

      {/* Dropdown Items */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-44 bg-white rounded-md shadow-lg z-50'>
          <ul className='py-1 text-sm text-gray-700'>
            {actions?.map((action, index) => {
              if (action.type === 'link') {
                return (
                  <li key={index}>
                    <Link
                      to={{
                        pathname: action.link,
                        ...(action.query && {
                          search: new URLSearchParams(action.query).toString()
                        })
                      }}
                      className='block px-4 py-2 hover:bg-gray-100'
                    >
                      {action.label}
                    </Link>
                  </li>
                )
              } else {
                return (
                  <li key={index}>
                    <button
                      type='button'
                      onClick={() => actionHandler(action)}
                      className='w-full text-left px-4 py-2 hover:bg-gray-100'
                    >
                      {action.label}
                    </button>
                  </li>
                )
              }
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
