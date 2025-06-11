import React from 'react'
import { useRoutes } from 'react-router-dom'
import Navbar from './pages/dashboard/layout/Navbar'
import { routes } from './routes/index'
import { Toaster } from 'react-hot-toast'

function App () {
  const route = useRoutes(routes)

  return (
    <React.Fragment>
      {/* Mount toast notifications */}
      <Toaster position='bottom-center' reverseOrder={false} />

      <Navbar />
      {route}
    </React.Fragment>
  )
}

export default App
