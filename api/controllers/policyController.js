import { StatusCodes } from 'http-status-codes'
import Policy from './../models/policy.js'
import Car from '../models/car.js'
import Responsibility from './../models/responsibility.js'
import DTA from '../models/dta.js'
import Zone from '../models/zone.js'
import User from '../models/user.js'
import Quotation from '../models/quotations.js'

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
      } else if (energy === 'GAS OIL' || energy === 'DIESEL' || energy === 'GAS') {
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

      const { id } = req.params
      const { zone } = req.query

      const { tariff, period, acc, cr, fc } = req.body
      let dta = req.body.dta // for safety

      const car = await Car.findOne({ _id: id, user: userId })
      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }
      const regNum = car.regNum

      const location = await Zone.findOne({ zone })
      if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Zone not found'
        })
      }

      // Apply base 10% discount.
      let discount = tariff - tariff * 0.1

      // Apply additional discount based on period
      const validPeriod = parseInt(period)
      let extraDiscount

      if (validPeriod === 2) {
        extraDiscount = 0.2
      }
      if (validPeriod === 4) {
        extraDiscount = 0.4
      }
      if (validPeriod === 6) {
        extraDiscount = 0.6
      }
      if (validPeriod === 8 || validPeriod === 10) {
        extraDiscount = 0.8
      }

      discount = discount * extraDiscount

      const vat = acc + TPN * 0.1925

      let total
      if (dta) {
        total = TPN + vat + acc + fc + cr + dta
      } else {
        total = TPN + vat + acc + fc + cr
      }

      let data
      if (dta) {
        data = { total, vat, fc, cr, tariff, discount, dta }
      } else {
        data = { total, vat, fc, cr, tariff, discount }
      }

      res.status(StatusCodes.CREATED).json({
        message: `Insurance quotation for vehicle with reg number ${regNum} and zone {location.type}({location.name})`,
        data
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to calculate insurance quotation',
        error: error.message
      })
    }
  },
  saveQuotation: async (req, res) => {
    try {
      const { id } = req.params
      const { zone } = req.query
      const userId = req.user.id

      const { total, vat, fc, tariff, discount } = req.body
      let dta = req.body.dta

      const user = await User.findById(userId)

      const car = await Car.findOne({ _id: id, user: userId })
      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }
      const carId = car._id

      const location = await Zone.findOne({ zone })
      if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Zone not found'
        })
      }
      const zoneId = location._id

      const insurance = new Quotation({
        total,
        vat,
        fc,
        tariff,
        discount,
        dta,
        zone: zoneId,
        user: userId,
        car: carId
      })

      const quotation = await insurance.save()
      car.quotation.push(quotation._id)
      await car.save()

      res.status(StatusCodes.Ok).json({
        message: 'Quotation saved',
        data: quotation
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to save insurance quotation',
        error: error.message
      })
    }
  }
}
