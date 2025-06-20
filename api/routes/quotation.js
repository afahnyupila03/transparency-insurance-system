import { quotations } from '../controllers/quotationController.js'
import { carAuthorization } from '../middlewares/authorization/carOwner.js'
import { authAuthorization } from '../middlewares/auth/userAuth.js'

export const quotationRoute = router => {
  router.get(
    '/quotations',
    authAuthorization.auth,
    carAuthorization.carOwner,
    quotations.getAllQuotations
  )
  router.get(
    '/quotation/:id',
    authAuthorization.auth,
    carAuthorization.carOwner,
    quotations.getQuotation
  )
}
