
import { carPolicies } from '../controllers/policyController.js';
import { middlewares } from './../middlewares/userAuth.js';

export const policy = router => {
    router.get('/policy/get', middlewares.auth, middlewares.carOwner, carPolicies.getEligiblePolicies)
    router.post('/policy/calculate', middlewares.auth, middlewares.carOwner, carPolicies.calculateQuotation)
    router.post('/policy/save-quotation', middlewares.auth, middlewares.carOwner, carPolicies.saveQuotation)
}