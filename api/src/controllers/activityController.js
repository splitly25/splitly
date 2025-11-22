import { StatusCodes } from 'http-status-codes'
import { activityService } from '~/services/activityService.js'

const getActivities = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { limit = 10, offset = 0, types, dateFrom, dateTo } = req.query

    // Get activities for the user with filters
    let activities = await activityService.getActivitiesWithFilters(
      userId,
      {
        limit: parseInt(limit),
        offset: parseInt(offset),
        types: types ? types.split(',') : null,
        dateFrom: dateFrom ? parseInt(dateFrom) : null,
        dateTo: dateTo ? parseInt(dateTo) : null
      }
    )

    // Get total count for pagination
    const total = await activityService.getActivityCountByUser(userId, {
      types: types ? types.split(',') : null,
      dateFrom: dateFrom ? parseInt(dateFrom) : null,
      dateTo: dateTo ? parseInt(dateTo) : null
    })

    res.status(StatusCodes.OK).json({
      activities,
      total,
      hasMore: parseInt(offset) + activities.length < total
    })
  } catch (error) {
    next(error)
  }
}

const getActivityCount = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id

    const total = await activityService.getActivityCountByUser(userId)

    res.status(StatusCodes.OK).json({
      total,
      unread: 0 // Placeholder for future unread notification feature
    })
  } catch (error) {
    next(error)
  }
}

export const activityController = {
  getActivities,
  getActivityCount
}
