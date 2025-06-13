import Authentication from '../pages/auth/Authentication'
import CarDetailsPage from '../pages/cars/carDetails'
import CarsPage from '../pages/cars/cars'
import CreateCarPage from '../pages/cars/createCar'
import Dashboard from '../pages/dashboard/Dashboard'
import PoliciesPage from '../pages/policies/policies'
import QuotationsPage from '../pages/quotations/quotationsPage'

export const mainNavigation = [
  {
    path: 'authentication',
    element: <Authentication />
  },
  {
    path: 'dashboard',
    element: <CarsPage />
  },
  {
    path: 'create-car',
    element: <CreateCarPage />
  },
  {
    path: 'create-car/:id',
    element: <CreateCarPage />
  },
  {
    path: 'cars',
    element: <CarsPage />
  },
  {
    path: 'cars/:id',
    element: <CarDetailsPage />
  },
  {
    path: 'policies',
    element: <PoliciesPage />
  },
  {
    path: 'quotations',
    element: <QuotationsPage />
  }
]
