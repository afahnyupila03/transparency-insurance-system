import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import mongoose from 'mongoose'

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

import UserRoutes from './routes/index.js'


const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
)

app.use('/user', UserRoutes)

// Test route to verify server is running
app.get('/', (req, res) => {
  res.json({ message: 'Transparency Insurance System API is running!' })
})

const URL =
  'mongodb+srv://fulopila9:9qVjS5mTfmDVn2G2@cluster0.9mx0z.mongodb.net/TransparencyInsurance'

mongoose
  .connect(URL)
  .then(() => console.log('✅ Successfully connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message)
  })

export default app
