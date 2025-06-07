import express from 'express'
import { carRoutes } from './car.js'
import { authRoutes } from './auth.js'
import { policy } from './policy.js'

const router = express.Router()

authRoutes(router)
carRoutes(router)
policy(router)

export default router
