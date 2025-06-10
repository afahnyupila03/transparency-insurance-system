import { StatusCodes } from 'http-status-codes'
import Policy from './../models/policy.js'
import Car from '../models/car.js'
import Responsibility from './../models/responsibility.js'
import DTA from '../models/dta.js'
import Zone from '../models/zone.js'
import User from '../models/user.js'
import Quotation from '../models/quotations.js'
import mongoose from 'mongoose'

export const carPolicies = {
  getEligiblePolicies: async (req, res) => {
    try {
      const userId = req.user.id
      const { id, zone } = req.query

      const car = await Car.findOne({ _id: id, user: userId })

      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }

      if (!mongoose.Types.ObjectId.isValid(zone)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid zone ID'
        })
      }

      const location = await Zone.findById(zone)

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
      } else if (
        energy === 'GAS OIL' ||
        energy === 'DIESEL' ||
        energy === 'GAS'
      ) {
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
          error: 'No policy exist for selected vehicle'
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
        data: { policy, dta, responsibilities, car, location }
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

      const { id, zone } = req.query

      const { tariff, period, acc, cr, fc, startDate, endDate } = req.body
      let dta = req.body.dta // for safety

      console.log('values to be calculated: ', tariff, period, acc, cr, fc)

      const car = await Car.findOne({ _id: id, user: userId })
      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }
      const regNum = car.regNum

      console.log('zone query: ', zone)
      let zoneObjectId
      try {
        zoneObjectId = new mongoose.Types.ObjectId(zone)
      } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid zone ID format'
        })
      }

      const location = await Zone.findOne({ _id: zoneObjectId })
      if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Zone not found'
        })
      }

      // Apply base 10% discount.
      let discount = tariff - 0.1

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

      const vat = (acc + discount + fc) * 0.1925

      let total
      if (dta) {
        total = discount + vat + acc + fc + cr + dta
      } else {
        total = discount + vat + acc + fc + cr
      }

      let data
      if (dta) {
        data = {
          total,
          vat,
          fc,
          cr,
          tariff,
          discount,
          dta,
          validPeriod,
          startDate,
          endDate
        }
      } else {
        data = {
          total,
          vat,
          fc,
          cr,
          acc,
          tariff,
          discount,
          validPeriod,
          startDate,
          endDate
        }
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
      const { id, zone } = req.query
      const userId = req.user.id

      const { total, vat, fc, tariff, discount, startDate, endDate } = req.body
      let dta = req.body.dta

      const user = await User.findById(userId)

      const car = await Car.findOne({ _id: id, user: userId })
      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Selected vehicle not found.'
        })
      }
      const carId = car._id

      let zoneObjectId
      try {
        zoneObjectId = new mongoose.Types.ObjectId(zone)
      } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid zone ID format'
        })
      }

      const location = await Zone.findOne({ _id: zoneObjectId })
      if (!location) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Zone not found'
        })
      }

      const insurance = new Quotation({
        total,
        vat,
        fc,
        tariff,
        discount,
        dta,
        zone: location,
        user,
        car: carId,
        startDate,
        endDate
      })

      const quotation = await insurance.save()
      car.quotation.push(quotation._id)
      await car.save()

      console.log('to be save quotation: ', quotation)
      res.status(StatusCodes.OK).json({
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
