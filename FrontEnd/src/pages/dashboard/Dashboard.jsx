import { useEffect } from 'react'
import { useCars } from '../../hooks/carHook'

export default function Dashboard () {
  const { data, isLoading, isError, error } = useCars()

  useEffect(() => {
    if (data && data.length === 0) {
      console.log('No car profiles created')
    } else {
      console.log('car data: ', data)
    }
  }, [data])

  if (isLoading) return <p>Loading</p>
  if (isError) return <p>{error.message}</p>

  return <h1>Home page</h1>
}
