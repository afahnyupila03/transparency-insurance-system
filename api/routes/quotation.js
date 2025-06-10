import { quotations } from "../controllers/quotationController.js"
import { middlewares } from "../middlewares/userAuth.js"

export const quotationRoute = router => {
    router.get('/quotations', middlewares.auth, middlewares.carOwner, quotations.getAllQuotations)
    router.get('/quotation/:id', middlewares.auth, middlewares.carOwner, quotations.getQuotation)
}