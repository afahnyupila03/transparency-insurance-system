import mongoose from 'mongoose'
import policyRates from './policyRates.js'
import Policy from '../../models/policy.js'


const seedPolicyRates = async () => {
  try {


    console.log('MongoDB connected. Seeding tariffs...')

    await Policy.deleteMany({})
    await Policy.insertMany(policyRates)

    console.log('✅ Tariffs seeded successfully.')
  } catch (error) {
    console.error('❌ Seeding tariffs failed:', error)
    throw error
  }
}

export default seedPolicyRates
