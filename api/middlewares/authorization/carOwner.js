import { StatusCodes } from 'http-status-codes'
import User from '../../models/user.js'
import Car from '../../models/car.js'

export const carAuthorization = {
  carOwner: async (req, res, next) => {
    try {
      const carOwner = req.user.carOwner

      if (!carOwner) {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: 'Access denied. You must be a car owner to perform action'
        })
      }

      next()
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to verify car owner status',
        error: error.message
      })
    }
  },
  carEnabled: async (req, res, next) => {
    try {
      const { id } = req.params
      const car = await Car.findById(id)

      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Car not found.'
        })
      }

      if (car.status !== 'enabled') {
        return res.status(StatusCodes.FORBIDDEN).json({
          error: 'Access denied. Enable car to perform action'
        })
      }

      next()
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to verify car status',
        error: error.message
      })
    }
  }
}
