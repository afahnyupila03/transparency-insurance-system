import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useRoutes
} from 'react-router-dom'
import Navbar from './pages/dashboard/layout/Navbar'
import { routes } from './routes/index'



function App () {
  const route = useRoutes(routes)

  return (
    <React.Fragment>
      <Navbar />
      {route}
    </React.Fragment>
  )
}

export default App
