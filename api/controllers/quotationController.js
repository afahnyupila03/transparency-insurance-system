import { StatusCodes } from 'http-status-codes'
import User from '../models/user.js'
import Car from '../models/car.js'
import Quotation from '../models/quotations.js'
import mongoose from 'mongoose'

export const quotations = {
  getAllQuotations: async (req, res) => {
    try {
      const userId = req.user.userId
      const { carId } = req.query

      if (!mongoose.Types.ObjectId.isValid(carId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid car id'
        })
      }

      const user = await User.findById(userId)
      const car = await Car.findOne(carId)

      const quotations = await Quotation.find({ user: user, car: car })

      if (quotations.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          message: 'No insurance saved for vehicle!'
        })
      }

      res.status(StatusCodes.OK).json({
        message: 'Insurance quotations for vehicle',
        data: quotations
      })
    } catch (error) {
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

      res.status(StatusCodes.Ok).json({
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
