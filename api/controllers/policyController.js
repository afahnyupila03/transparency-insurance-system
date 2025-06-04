import { StatusCodes } from 'http-status-codes'
import Policy from './../models/policy.js'
import Car from '../models/car.js'
import Responsibility from './../models/responsibility.js'
import DTA from '../models/dta.js'
import Zone from '../models/zone.js'

export const carPolicies = {
  getEligiblePolicies: async (req, res) => {
    try {
      const userId = req.user.id
      const { zone } = req.query
      const { id } = req.params

      const car = await Car.findOne({ _id: id, user: userId })

      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }

      const location = await Zone.findOne({
        name: zone
      })

      if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Zone not found'
        })
      }

      const hpRating = parseInt(car.hpRating)
      if (isNaN(hpRating)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid horsepower rating'
        })
      }

      const genre = car.genre
      let type
      if (genre === 'VT' || genre === 'VP' || genre === 'TOURISME') {
        type = '1X'
      }

      if (!type) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Vehicle type is not supported'
        })
      }
      const energy = car.energy
      let fuel
      if (energy === 'ESS' || energy === 'ESSENCE' || energy === 'PATROL') {
        fuel = 'ESSENCE'
      } else if (energy === 'GAS OIL' || energy === 'DIESEL') {
        fuel = 'DIESEL'
      }

      if (!fuel) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Vehicle energy is not supported'
        })
      }

      const policy = await Policy.findOne({
        type: type,
        energy: fuel,
        'hpRange.min': { $lte: hpRating },
        'hpRange.max': { $gte: hpRating },
        zone: location.type
      })

      if (!policy) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'N policy exist for selected vehicle'
        })
      }

      const dta = await DTA.findOne({
        type: type,
        'hpRange.min': { $lte: hpRating },
        'hpRange.max': { $gte: hpRating }
      })

      if (!dta) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'no DTA quotation exist for selected vehicle'
        })
      }

      const responsibilities = await Responsibility.find()

      res.status(StatusCodes.OK).json({
        message: 'Policy for car fetched',
        data: { policy, dta, responsibilities }
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching policies',
        error: error.message
      })
    }
  },
  calculateQuotation: async (req, res) => {
    try {
      const userId = req.user.id

      const {id} = req.params
      const {zone} = req.query

      const {tariff, period, acc, cr, fc} = req.body
      let dta = req.body.dta // for safety


      // calculations
      const discount = tariff * 0.10
      const TPN = tariff - discount

      const validPeriod = parseInt(period)
      // if ( validPeriod === 2)


    } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Failed to calculate insurance quotation',
      error: error.message
    })
  }
  } 
}
