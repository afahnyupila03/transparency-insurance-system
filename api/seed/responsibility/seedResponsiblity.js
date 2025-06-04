import mongoose from 'mongoose'
import { responsibilityRates } from './responsibilities.js'
import Responsibility from '../../models/responsibility.js'

const seedResponsibility = async () => {
  try {
    console.log('MongoDB connected. Seeding responsibilities...')

    await Responsibility.deleteMany({})
    await Responsibility.insertMany(responsibilityRates)

    console.log('✅ responsibilities seeded successfully.')
  } catch (error) {
    console.error('❌ Seeding responsibilities failed:', error)
  }
}

export default seedResponsibility
