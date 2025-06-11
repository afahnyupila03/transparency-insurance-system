import { BASE_URL } from "../url"



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

export const getZonesService = async ({
  search = '',
  skip = 0,
  limit = 10
}) => {
  const res = await fetch(
    `${BASE_URL}/zones?search=${search}&limit=${limit}&skip=${skip}`,
    getHeaders('GET')
  )
  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const getPolicyService = async (id, zone) => {
  try {
    const res = await fetch(
      `${BASE_URL}/policy/get?id=${id}&zone=${zone}`,
      getHeaders('GET')
    )

    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    return data
  } catch (error) {
    throw new Error(`An unexpected error occurred: ${error.message}`)
  }
}

export const calculatePolicyService = async (id, zone, payload) => {
  const res = await fetch(
    `${BASE_URL}/policy/calculate?id=${id}&zone=${zone}`,
    getHeaders('POST', payload)
  )

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}

export const savePolicyService = async (id, zone, payload) => {
  const res = await fetch(
    `${BASE_URL}/policy/save-quotation?id=${id}&zone=${zone}`,
    getHeaders('POST', payload)
  )

  const data = await res.json()

  if (!res.ok) throw new Error(data.error)

  return data
}
