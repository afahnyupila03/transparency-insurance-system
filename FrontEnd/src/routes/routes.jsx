import Authentication from '../pages/auth/Authentication'
import Dashboard from '../pages/dashboard/Dashboard'

export const mainNavigation = [
  {
    path: 'authentication',
    element: <Authentication />
  },
  {
    path: 'dashboard',
    element: <Dashboard />
  }
]
