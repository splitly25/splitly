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

const scan = async (req, res, next) => {
  try {
    const scannedBill = await billService.scanBill(req.body)
    res.status(StatusCodes.OK).json(scannedBill)

  } catch (error) {next(error)}
}

const getBillById = async (req, res, next) => {
  try {
    const { billId } = req.params
    const bill = await billService.getBillById(billId)
    res.status(StatusCodes.OK).json(bill)
  } catch (error) {
    next(error)
  }
}

const getMutualBills = async (req, res, next) => {
  try {
    const { userId, creditorId } = req.params
    const mutualBills = await billService.getMutualBills(userId, creditorId)
    res.status(StatusCodes.OK).json(mutualBills)
  } catch (error) {
    next(error)
  }
}

const updateBill = async (req, res, next) => {
  try {
    const { billId } = req.params
    const updatedBill = await billService.updateBill(billId, req.body)
    res.status(StatusCodes.OK).json(updatedBill)
  } catch (error) {
    next(error)
  }
}

export const billController = {
  createNew, 
  scan,
  getBillsByUserId,
  getBillById,
  getMutualBills,
  updateBill,
}
