import Authentication from '../pages/auth/Authentication'
import CreateCarPage from '../pages/createCar'
import Dashboard from '../pages/dashboard/Dashboard'

export const mainNavigation = [
  {
    path: 'authentication',
    element: <Authentication />
  },
  {
    path: 'dashboard',
    element: <Dashboard />
  }, 
  {
    path: 'create-car',
    element: <CreateCarPage />
  }
]
