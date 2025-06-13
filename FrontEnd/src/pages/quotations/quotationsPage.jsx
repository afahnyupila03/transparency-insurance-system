import { useSearchParams } from 'react-router-dom'
import { useQuotationsHook } from '../../hooks/quotationHook'
import { useState } from 'react'

export default function QuotationsPage () {
  const [searchParams] = useSearchParams()
  const carId = searchParams.get('car_id')

  console.log('quotations_id: ', carId)

  const { data, isLoading, isError, error } = useQuotationsHook(carId)

  const [searchTerm, setSearchTerm] = useState('')

  if (isLoading) {
    return <p className='text-center py-10'>Loading car quotations...</p>
  }

  if (isError) {
    return <p className='text-center py-10 text-red-600'>{error.message}</p>
  }

  console.log('quotations data: ', data.data)
  const quotations = data.data || []

  // Filter quotations by startDate (partial match or exact)
  const filteredQuotations = quotations.filter(q =>
    q.startDate?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='min-h-screen w-full px-8 py-10 bg-gray-100'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-2xl font-semibold mb-6 text-center'>
          Insurance Quotations
        </h1>

        {/* Search by startDate */}
        <div className='mb-6'>
          <input
            type='text'
            placeholder='Search by start date (YYYY-MM-DD)'
            className='w-full p-3 border border-gray-300 rounded-lg shadow-sm'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredQuotations.length === 0 ? (
          <p className='text-center text-gray-600'>No quotations found.</p>
        ) : (
          <div className='space-y-4'>
            {filteredQuotations.map((q, index) => (
              <div
                key={q._id || index}
                className='bg-white rounded-xl shadow p-5 border'
              >
                <p>
                  <span className='font-medium'>Start Date:</span>{' '}
                  {new Date(q.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className='font-medium'>End Date:</span>{' '}
                  {new Date(q.endDate).toLocaleDateString()}
                </p>
                <p>
                  <span className='font-medium'>DTA:</span> {Math.ceil(q.dta)}{' '}
                  FCFA
                </p>
                <p>
                  <span className='font-medium'>Discount:</span>{' '}
                  {Math.ceil(q.discount)}
                </p>
                <p>
                  <span className='font-medium'>VAT:</span> {Math.ceil(q.vat)}{' '}
                  FCFA
                </p>
                <p>
                  <span className='font-medium'>Total:</span>{' '}
                  {Math.ceil(q.total)} FCFA
                </p>
                <p>
                  <span className='font-medium'>Period:</span> {q.period} Months
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
