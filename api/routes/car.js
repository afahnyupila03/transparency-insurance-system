import { carProfiles } from '../controllers/carController.js'
import { middlewares } from '../middlewares/userAuth.js'

export const carRoutes = router => {
  router.post('/create', middlewares.auth, carProfiles.createCar)
  router.get(
    '/cars',
    middlewares.auth,
    middlewares.carOwner,
    carProfiles.viewCars
  )
  router.get(
    '/car/:id',
    middlewares.auth,
    middlewares.carOwner,
    carProfiles.viewCar
  )
  router.put(
    '/update-car',
    middlewares.auth,
    middlewares.carOwner,
    carProfiles.editCar
  )
  router.put(
    '/update-car-status',
    middlewares.auth,
    middlewares.carOwner,
    carProfiles.carStatus
  )
}
