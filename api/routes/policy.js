
import { carPolicies } from '../controllers/policyController.js';
import { middlewares } from './../middlewares/userAuth.js';

export const policy = router => {
    router.get('/policy/:id', middlewares.auth, middlewares.carOwner, carPolicies.getEligiblePolicies)
    router.post('/policy/:id', middlewares.auth, middlewares.carOwner, carPolicies.calculateQuotation)
    router.post('/policy/:id', middlewares.auth, middlewares.carOwner, carPolicies.saveQuotation)
}