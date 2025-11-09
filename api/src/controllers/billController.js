import { StatusCodes } from 'http-status-codes'
import { billService } from '~/services/billService.js'

const createNew = async (req, res, next) => {
  try {
    const createdBill = await billService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdBill)
  } catch (error) { next(error) }
}

const scan = async (req, res, next) => {
  try {
    const scannedBill = await billService.scanBill(req.body)
    res.status(StatusCodes.OK).json(scannedBill)

  } catch (error) {next(error)}
}

export const billController = {
  createNew, 
  scan,
}