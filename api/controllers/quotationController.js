import { StatusCodes } from 'http-status-codes'
import User from '../models/user.js'
import Car from '../models/car.js'
import Quotation from '../models/quotations.js'
import mongoose from 'mongoose'

export const quotations = {
  getAllQuotations: async (req, res) => {
    try {
      const userId = req.user.id
      const { carId } = req.query

      // Validate and cast carId
      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid car ID format. Must be a valid MongoDB ObjectId.'
        })
      }

      const carObjectId = new mongoose.Types.ObjectId(carId)

      // Validate and fetch user & car
      const user = await User.findById(userId)
      if (!user) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'User not found' })
      }

      const car = await Car.findById(carObjectId)
      if (!car) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: 'Car not found' })
      }

      const quotations = await Quotation.find({
        user: user._id,
        car: car._id
      })

      if (quotations.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'No insurance saved for vehicle!'
        })
      }

      return res.status(StatusCodes.OK).json({
        message: 'Insurance quotations for vehicle',
        data: quotations
      })
    } catch (error) {
      console.log('error: ', error.message)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching insurance quotations',
        error: error.message
      })
    }
  },
  getQuotation: async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params

      const quotation = await Quotation.findById(id)
        .populate('user')
        .populate('car')

      res.status(StatusCodes.OK).json({
        message: 'Insurance quotation',
        data: { quotation }
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error fetching insurance quotation',
        error: error.message
      })
    }
  }
}
