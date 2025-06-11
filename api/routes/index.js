import express from 'express'
import { carRoutes } from './car.js'
import { authRoutes } from './auth.js'
import { policy } from './policy.js'
import { zoneRoute } from './meta.js'
import { quotationRoute } from './quotation.js'

const router = express.Router()

authRoutes(router)
carRoutes(router)
policy(router)
zoneRoute(router)
quotationRoute(router)

export default router
