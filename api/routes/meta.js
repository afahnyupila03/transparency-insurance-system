import { StatusCodes } from 'http-status-codes'
import { middlewares } from '../middlewares/userAuth.js'
import Zone from '../models/zone.js'

export const zoneRoute = router => {
  router.get(
    '/zones',
    middlewares.auth,
    middlewares.carOwner,
    async (req, res) => {
      try {
        const { limit = 10, skip = 0, search = '' } = req.query

        const query = {
          name: { $regex: search, $options: 'i' }
        }

        const zones = await Zone.find(query)
          .skip(parseInt(skip))
          .limit(parseInt(limit))

        if (zones.length === 0) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            error: 'No zones in system.'
          })
        }

        const total = await Zone.find(query).countDocuments()

        res.status(StatusCodes.OK).json({
          message: 'Policy Zones',
          data: zones,
          total
        })
      } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: 'Error fetching zones',
          error: error.message
        })
      }
    }
  )
}
