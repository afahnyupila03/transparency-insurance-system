import { carPolicies } from '../controllers/policyController.js'
import { carAuthorization } from '../middlewares/authorization/carOwner.js'
import { authAuthorization } from './../middlewares/auth/userAuth.js'

export const policy = router => {
  router.get(
    '/policy/get',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carPolicies.getEligiblePolicies
  )
  router.post(
    '/policy/calculate',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carPolicies.calculateQuotation
  )
  router.post(
    '/policy/save-quotation',
    authAuthorization.auth,
    carAuthorization.carOwner,
    carPolicies.saveQuotation
  )
}
