import DropdownComponent from './Dropdown'

export default function CarListContainer ({ data, actions, actionHandler }) {
  const { _id, regNum, mark, genre, name, createdAt, status } = data

  const statusColor =
    status === 'enabled'
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-200 text-gray-600'

  return (
    <div className='bg-white rounded-xl shadow-md p-4 mb-6'>
      {/* Header: Mark and Dropdown */}
      <div className='flex items-center justify-between mb-3' key={_id}>
        <div className='flex items-center gap-x-2'>
          <p className='text-lg font-semibold text-gray-800'>{mark}</p>
          <span
            style={{ textTransform: 'capitalize' }}
            className={`text-xs font-semibold px-2.5 py-0.5 rounded ${statusColor}`}
          >
            {status}
          </span>
        </div>

        <div>
          <DropdownComponent actions={actions} actionHandler={actionHandler} />
        </div>
      </div>

      {/* Car Info */}
      <div className='flex flex-col gap-2 text-sm text-gray-700 mb-4'>
        <p>
          <span className='font-medium'>Registration:</span> {regNum}
        </p>
        <p>
          <span className='font-medium'>Genre:</span> {genre}
        </p>
        <p>
          <span className='font-medium'>Owner:</span> {name}
        </p>
      </div>

      <hr className='my-2' />

      {/* Footer: Created Date */}
      <div className='text-xs text-gray-500 text-right'>
        <p>Created on: {new Date(createdAt).toDateString()}</p>
      </div>
    </div>
  )
}
