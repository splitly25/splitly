import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/APIError.js'

const createNew = async (req, res, next) => {
  try {

    // Controller navigate to SERVICE LAYER
    const createdBoard = await boardService.createNew(req.body)

    // Return end response
    res.status(StatusCodes.CREATED).json(createdBoard)

  } catch (error) { next(error) }
}

export const boardController = {
  createNew
}