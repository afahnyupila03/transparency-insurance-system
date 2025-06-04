import mongoose from 'mongoose'
import policyRates from './policyRates.js'
import Policy from '../models/policy.js'

const URL =
  'mongodb+srv://fulopila9:9qVjS5mTfmDVn2G2@cluster0.9mx0z.mongodb.net/TransparencyInsurance'

const seedPolicyRates = async () => {
  try {
    await mongoose.connect(URL)

    console.log('MongoDB connected. Seeding...')

    await Policy.deleteMany({})
    await Policy.insertMany(policyRates)

    console.log('✅ Tariffs seeded successfully.')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  }
}

export default seedPolicyRates
