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
                // Destructure and separate hash if present
                let to
                if (action.link.startsWith('#')) {
                  to = {
                    pathname: '', // or use current path if you like, via useLocation().pathname
                    hash: action.link,
                    ...(action.query && {
                      search: new URLSearchParams(action.query).toString()
                    })
                  }
                } else {
                  to = {
                    pathname: action.link,
                    ...(action.query && {
                      search: new URLSearchParams(action.query).toString()
                    })
                  }
                }

                return (
                  <li key={index}>
                    <Link
                      to={to}
                      onClick={toggleDropdown}
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
                      onClick={() => {
                        toggleDropdown()
                        actionHandler(action)
                      }}
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
