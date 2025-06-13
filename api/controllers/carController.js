import { StatusCodes } from 'http-status-codes'
import Car from '../models/car.js'
import User from '../models/user.js'

export const carProfiles = {
  createCar: async (req, res) => {
    try {
      const userId = req.user.id

      const {
        regNum,
        name,
        address,
        genre,
        type,
        mark,
        chassisNumber,
        energy,
        hpRating,
        numberOfSeats,
        carryingCapacity,
        firstYear
      } = req.body

      // if (!userId) {
      //   return res.status(StatusCodes.UNAUTHORIZED).json({
      //     message: 'Please authenticate account to create car profile'
      //   })
      // }

      const user = await User.findById(userId)
      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'User not found.'
        })
      }

      const existingDeletedCar = await Car.findOne({
        regNum: regNum,
        chassisNumber: chassisNumber,
        status: 'deleted'
      })

      const existingRegNum = await Car.findOne({
        regNum: regNum,
        status: { $ne: 'deleted' }
      })

      if (existingRegNum) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Car profile with registration number ${regNum} already exist in system.`
        })
      }

      const existingChassisNumber = await Car.findOne({
        chassisNumber: chassisNumber,
        status: { $ne: 'deleted' }
      })

      if (existingChassisNumber) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Car profile with chassis number ${chassisNumber} already exist in system.`
        })
      }

      if (existingDeletedCar) {
        // set status to enabled.
        existingDeletedCar.status = 'enabled'

        // Incase of existing deleted car has new field values, update.
        existingDeletedCar.set({
          name,
          address,
          regNum,
          genre,
          type,
          mark,
          chassisNumber,
          energy,
          hpRating: parseInt(hpRating),
          numberOfSeats: parseInt(numberOfSeats),
          carryingCapacity: parseInt(carryingCapacity),
          firstYear,
          user: user._id
        })
        // save car.
        await existingDeletedCar.save()

        // update user.car_array.
        user.car.push(existingDeletedCar._id)

        // save user.
        await user.save()

        return res.status(StatusCodes.OK).json({
          message: 'Existing deleted car restored and updated',
          data: existingDeletedCar
        })
      }

      const car = new Car({
        regNum,
        name,
        address,
        genre,
        type,
        mark,
        chassisNumber,
        energy,
        hpRating: parseInt(hpRating),
        numberOfSeats: parseInt(numberOfSeats),
        carryingCapacity: parseInt(carryingCapacity),
        firstYear,
        user: user._id
      })

      const data = await car.save()

      user.car.push(data._id)
      user.isCarOwner = true

      await user.save()

      res.status(StatusCodes.CREATED).json({
        message: 'Car profile created',
        data
      })
    } catch (error) {
      console.log('create car error: ', error)
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error creating user car profile',
        error: error.message
      })
    }
  },
  viewCars: async (req, res) => {
    try {
      const userId = req.user.id

      // if (!userId) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     error: 'Please authenticate profile to perform action'
      //   })
      // }

      const user = await User.findById(userId)

      if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'User not found, please create user account.'
        })
      }

      const cars = await Car.find({ user: user._id })

      if (cars.length === 0) {
        return res.status(StatusCodes.NO_CONTENT).json({
          message: 'You have zero car profiles.'
        })
      }

      res.status(StatusCodes.OK).json({
        message: 'viewing user car profiles',
        data: cars
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error viewing user car profiles',
        error: error.message
      })
    }
  },
  viewCar: async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params

      // if (!userId) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     error: 'Please authenticate profile to perform action'
      //   })
      // }

      const car = await Car.findOne({ _id: id, user: userId })

      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Car profile not found.'
        })
      }

      res.status(StatusCodes.OK).json({
        message: 'viewing user car profile',
        data: car
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error view user car profile',
        error: error.message
      })
    }
  },
  editCar: async (req, res) => {
    try {
      const userId = req.user.id
      const { id } = req.params

      const { regNum, name, genre } = req.body

      const car = await Car.findOne({ _id: id, user: userId }).populate(
        'user',
        'name email phone'
      )

      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Car profile not found, please car profile.'
        })
      }

      if (regNum) car.regNum = regNum
      if (name) car.name = name

      if (regNum && regNum !== car.regNum) {
        const existingCar = await Car.findOne({ regNum, _id: { $ne: id } })
        if (existingCar) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: `Registration number ${regNum} already exists.`
          })
        }

        car.genre = genre
      }

      const updatedCar = await car.save()

      res.status(StatusCodes.OK).json({
        message: 'User car profile updated.',
        data: updatedCar
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating car profile',
        error: error.message
      })
    }
  },
  carStatus: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.user.id
      const { status } = req.body

      if (!status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Status is required.'
        })
      }

      const validStatuses = ['enabled', 'disabled', 'deleted'] // adjust as needed
      if (!validStatuses.includes(status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: `Invalid status value. Allowed: ${validStatuses.join(', ')}.`
        })
      }

      const car = await Car.findOne({ _id: id, user: userId })
      if (!car) {
        return res.status(StatusCodes.NOT_FOUND).json({
          error: 'Car profile not found.'
        })
      }

      if (car.status === status) {
        return res.status(StatusCodes.OK).json({
          message: 'Status is already up to date.',
          data: car
        })
      }

      car.status = status
      await car.save()

      res.status(StatusCodes.OK).json({
        message: 'Car profile status updated.',
        data: car
      })
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Error updating car profile status',
        error: error.message
      })
    }
  }
}
