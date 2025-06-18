import { carProfiles } from '../controllers/carController.js'
import { carAuthorization } from '../middlewares/authorization/carOwner.js'
import { authAuthorization } from '../middlewares/auth/userAuth.js'

export const carRoutes = router => {
  router.post('/create', authAuthorization.auth, carProfiles.createCar)
  router.get(
    '/cars',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carProfiles.viewCars
  )
  router.get(
    '/car/:id',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carProfiles.viewCar
  )
  router.put(
    '/update-car/:id',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carProfiles.editCar
  )
  router.put(
    '/update-car-status/:id',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carProfiles.carStatus
  )
}
