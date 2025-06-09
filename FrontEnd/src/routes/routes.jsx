import Authentication from '../pages/auth/Authentication'
import CarDetailsPage from '../pages/cars/carDetails'
import CarsPage from '../pages/cars/cars'
import CreateCarPage from '../pages/cars/createCar'
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
  }
]
