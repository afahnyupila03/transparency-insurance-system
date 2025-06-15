import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
import UserRoutes from './routes/index.js'
import seedPolicyRates from './seed/policy/seedPolicyRates.js'
import seedDtaRates from './seed/dta/seedDtaRates.js'
import seedZones from './seed/zone/seedZones.js'
import seedResponsibility from './seed/responsibility/seedResponsiblity.js'

const app = express()
const server = http.createServer(app)

// Middleware
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// CORS settings
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Transparency Insurance System API is running!' })
})

// Routes
app.use(UserRoutes)

// Catch 404 errors and return JSON response
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
  // next(createError(404, 'Route not found'))
})

// Error handler returning JSON instead of rendering a view
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: req.app.get('env') === 'development' ? err : {}
  })
})

// MongoDB connection
const MONGO_URI = process.env.DB_URL

// Run server immediately, and seed in background
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Successfully connected to MongoDB')

    // Run seeding async (non-blocking)
    ;(async () => {
      try {
        await seedPolicyRates()
        await seedDtaRates()
        await seedZones()
        await seedResponsibility()
        console.log('🌱 Seeding complete')
      } catch (e) {
        console.error('❌ Seeding error:', e.message)
      }
    })()

    // Start server
    server.listen(3000, () => {
      console.log('🚀 App server running at http://localhost:3000')
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
  })

export default app
