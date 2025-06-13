function getHeaders (method, payload) {
  const token = localStorage.getItem('token')
  if (!token) {
    throw new Error(
      'Invalid or expired user token, please authenticate user again.'
    )
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  }

  const options = {
    method,
    headers
  }

  if (method === 'POST' || method === 'PUT') {
    options.body = JSON.stringify(payload)
  }

  return options
}

export const viewQuotationsServices = async carId => {
  const res = await fetch(
    `http://localhost:3000/quotations?carId=${carId}`,
    getHeaders('GET')
  )

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  console.log('error: ', data.error)

  return data
}
export const viewQuotationService = async id => {
  const res = await fetch(
    `http://localhost:3000/quotation/${id}`,
    getHeaders('GET')
  )

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}
