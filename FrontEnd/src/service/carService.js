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

export const createCarService = async payload => {
  const res = await fetch(
    'http://localhost:3000/create',
    getHeaders('POST', payload)
  )

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const viewCarsService = async () => {
  const res = await fetch('http://localhost:3000/cars', getHeaders('GET'))
  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const viewCarService = async id => {
  const res = await fetch(`http://localhost:3000/car/${id}`, getHeaders('GET'))
  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const updateCarService = async (id, payload) => {
  const res = await fetch(
    `http://localhost:3000/update-car/${id}`,
    getHeaders('PUT', payload)
  )
  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const updateCarStatusService = async (id, payload) => {
  const res = await fetch(
    `http://localhost:3000/update-car-status/${id}`,
    getHeaders('PUT', payload)
  )
  const data = await res.json()

  if (!res.ok) throw new Error(data.error)
}
