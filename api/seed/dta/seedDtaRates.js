import mongoose from 'mongoose'
import rates from './dtaRates.js'
import DTA from '../../models/dta.js'


const seedDtaRates = async () => {
  try {
   

    console.log('MongoDB connected. Seeding dta...')

    await DTA.deleteMany({})
    await DTA.insertMany(rates)

    console.log('✅ dta seeded successfully.')
  } catch (error) {
    console.error('❌ Seeding dta failed:', error)
    throw error
  }
}

export default seedDtaRates
