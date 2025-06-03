import express from 'express'
import { carRoutes } from './car.js'
import { authRoutes } from './auth.js'

const router = express.Router()

// const appRoute = router

// Routes for app.
authRoutes(router)
carRoutes(router)

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'Express' })
// })

export default router
