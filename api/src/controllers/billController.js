import { StatusCodes } from 'http-status-codes'
import { billService } from '~/services/billService.js'

const createNew = async (req, res, next) => {
  try {
    const createdBill = await billService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBill)
  } catch (error) {
    next(error)
  }
}

const getBillsByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params
    const bills = await billService.getBillsByUserId(userId)
    res.status(StatusCodes.OK).json(bills)
  } catch (error) {
    next(error)
  }
}

export const billController = {
  createNew,
  getBillsByUserId,
}
